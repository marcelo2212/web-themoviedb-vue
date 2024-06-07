import { mount, createLocalVue } from '@vue/test-utils';
import AppSidebar from '@/components/AppSidebar.vue';
import VueRouter from 'vue-router';
import axios from 'axios';
import { eventBus } from '@/utils/eventBus.js';

jest.mock('axios');
jest.mock('@/utils/eventBus.js', () => ({
  eventBus: {
    emit: jest.fn(),
  },
}));

const localVue = createLocalVue();
localVue.use(VueRouter);
const router = new VueRouter();

describe('AppSidebar.vue', () => {
  let wrapper;

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: { genres: [{ id: 1, name: 'Action' }] } });

    wrapper = mount(AppSidebar, {
      localVue,
      router,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('toggles the order accordion correctly', async () => {
    expect(wrapper.vm.accordionOpenOrder).toBe(false);
    const button = wrapper.findAll('button').at(0);
    await button.trigger('click');
    expect(wrapper.vm.accordionOpenOrder).toBe(true);
    await button.trigger('click');
    expect(wrapper.vm.accordionOpenOrder).toBe(false);
  });

  it('toggles the filter accordion correctly', async () => {
    expect(wrapper.vm.accordionOpenFilter).toBe(false);
    const button = wrapper.findAll('button').at(1);
    await button.trigger('click');
    expect(wrapper.vm.accordionOpenFilter).toBe(true);
    await button.trigger('click');
    expect(wrapper.vm.accordionOpenFilter).toBe(false);
  });

  it('fetches genres correctly', async () => {
    await wrapper.vm.fetchGenres();
    expect(wrapper.vm.genres).toEqual([{ id: 1, name: 'Action' }]);
    expect(wrapper.vm.genresLoaded).toBe(true);
  });

  it('updates filters correctly', async () => {
    wrapper.vm.filters.sortBy = 'vote_average.desc';
    await wrapper.vm.updateFilters();
    expect(eventBus.emit).toHaveBeenCalledWith('filters-updated', wrapper.vm.filters);
  });

  it('toggles genre selection correctly', async () => {
    const genreId = 1;
    wrapper.vm.toggleGenreSelection(genreId);
    expect(wrapper.vm.selectedGenres).toContain(genreId);
    wrapper.vm.toggleGenreSelection(genreId);
    expect(wrapper.vm.selectedGenres).not.toContain(genreId);
  });

  it('shows and hides the tooltip correctly', async () => {
    expect(wrapper.vm.tooltipVisible).toBe(false);
    wrapper.vm.showTooltip();
    expect(wrapper.vm.tooltipVisible).toBe(true);
    wrapper.vm.hideTooltip();
    expect(wrapper.vm.tooltipVisible).toBe(false);
  });

  it('searches for keywords correctly', async () => {
    const mockKeywordResults = [{ id: 1, name: 'test' }];
    axios.get.mockResolvedValueOnce({ data: { results: mockKeywordResults } });
    const results = await wrapper.vm.searchKeywords('test');
    expect(results).toEqual(mockKeywordResults);
    expect(wrapper.vm.keywordResults).toEqual(mockKeywordResults);
  });

  it('selects and deselects certification correctly', async () => {
    const certification = 'PG-13';
    wrapper.vm.selectCertification(certification);
    expect(wrapper.vm.filters.certification).toBe(certification);
    wrapper.vm.selectCertification(certification);
    expect(wrapper.vm.filters.certification).toBe('');
  });
});
