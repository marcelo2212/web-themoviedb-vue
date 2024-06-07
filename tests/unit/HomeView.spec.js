import { mount } from '@vue/test-utils';
import HomeView from '@/views/HomeView.vue';
import { eventBus } from '@/utils/eventBus.js';

jest.mock('@/utils/eventBus.js', () => ({
  on: jest.fn(),
  off: jest.fn()
}));

describe('HomeView.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(HomeView);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders correctly', () => {
    expect(wrapper.html()).toContain('MovieList');
  });

  it('updates filters on event bus event', async () => {
    const newFilters = {
      sortBy: 'vote_average.desc',
      language: 'en',
      keywords: 'action',
      release_date_init: '2020-01-01',
      release_date_final: '2020-12-31',
      with_genres: '28',
      certification: 'R'
    };

    eventBus.on.mock.calls[0][1](newFilters);
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.filters).toEqual(newFilters);
  });

  it('registers event bus listener on mount and unregisters on unmount', () => {
    expect(eventBus.on).toHaveBeenCalledWith('filters-updated', wrapper.vm.handleFiltersUpdate);
    wrapper.unmount();
    expect(eventBus.off).toHaveBeenCalledWith('filters-updated', wrapper.vm.handleFiltersUpdate);
  });
});
