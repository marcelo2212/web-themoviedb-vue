import { mount, createLocalVue } from '@vue/test-utils';
import MovieList from '@/components/MovieList.vue';
import VueRouter from 'vue-router';
import axios from 'axios';

jest.mock('axios');

const localVue = createLocalVue();
localVue.use(VueRouter);
const router = new VueRouter();

describe('MovieList.vue', () => {
  let wrapper;

  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: {
        results: [
          { id: 1, title: 'Movie 1', release_date: '2023-01-01', backdrop_path: '/path1.jpg' },
          { id: 2, title: 'Movie 2', release_date: '2023-01-02', backdrop_path: '/path2.jpg' },
        ],
      },
    });

    wrapper = mount(MovieList, {
      localVue,
      router,
      propsData: {
        filters: {
          sortBy: 'popularity.desc',
          language: 'all',
          keywords: '',
          release_date_init: '',
          release_date_final: '',
          with_genres: '',
          certification: '',
        },
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('fetches movies on created', async () => {
    await wrapper.vm.$nextTick();
    expect(axios.get).toHaveBeenCalled();
    expect(wrapper.vm.movies.length).toBe(2);
  });

  it('displays loading state', async () => {
    wrapper.setData({ loading: true });
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.text-center').text()).toBe('Carregando...');
  });

  it('formats date correctly', () => {
    const formattedDate = wrapper.vm.formatDate('2023-01-01');
    expect(formattedDate).toBe('01/jan/2023');
  });

  it('updates movies when filters change', async () => {
    const newFilters = { ...wrapper.props().filters, sortBy: 'release_date.desc' };
    await wrapper.setProps({ filters: newFilters });
    await wrapper.vm.$nextTick();
    expect(axios.get).toHaveBeenCalledTimes(2);
  });

  it('loads more movies on loadMore button click', async () => {
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.page).toBe(1);
    const button = wrapper.find('button');
    await button.trigger('click');
    expect(wrapper.vm.page).toBe(2);
    expect(axios.get).toHaveBeenCalledTimes(2);
  });

  it('navigates to movie detail on movie click', async () => {
    await wrapper.vm.$nextTick();
    const movieDiv = wrapper.findAll('.cursor-pointer').at(0);
    await movieDiv.trigger('click');
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith({ name: 'movieDetail', params: { id: 1 } });
  });
});
