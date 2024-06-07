import { mount, createLocalVue } from '@vue/test-utils';
import MovieDetailView from '@/views/MovieDetailView.vue';
import axios from 'axios';
import VueRouter from 'vue-router';

jest.mock('axios');

const localVue = createLocalVue();
localVue.use(VueRouter);
const router = new VueRouter();

describe('MovieDetailView.vue', () => {
  let wrapper;
  const mockMovie = {
    backdrop_path: 'path/to/image.jpg',
    title: 'Test Movie',
    release_date: '2020-01-01',
    vote_average: 7.5,
    vote_count: 1000,
    overview: 'Test overview',
    genres: [{ id: 1, name: 'Action' }],
    budget: 100000000,
    revenue: 500000000
  };

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockMovie });

    wrapper = mount(MovieDetailView, {
      localVue,
      router,
      mocks: {
        $route: {
          params: { id: '1' }
        }
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches and renders movie details correctly', async () => {
    await wrapper.vm.$nextTick();

    expect(wrapper.find('h1').text()).toBe(mockMovie.title);
    expect(wrapper.find('p').text()).toBe(wrapper.vm.formatDate(mockMovie.release_date));
    expect(wrapper.find('v-progress-circular').text()).toContain(mockMovie.vote_average * 10 + '%');
    expect(wrapper.find('v-progress-circular').attributes('model-value')).toBe(String(mockMovie.vote_average * 10));
    expect(wrapper.find('.flex-grow').text()).toContain(mockMovie.vote_count + ' votos');
    expect(wrapper.find('h2').text()).toBe('Sinopse');
    expect(wrapper.find('.text-gray-700').text()).toBe(mockMovie.overview);
    expect(wrapper.find('.bg-blue-500').text()).toBe(mockMovie.genres[0].name);
    expect(wrapper.find('.bg-blue-500').text()).toBe('Voltar');
  });

  it('formats date correctly', () => {
    const formattedDate = wrapper.vm.formatDate(mockMovie.release_date);
    expect(formattedDate).toBe('01/jan/2020');
  });

  it('formats currency correctly', () => {
    const formattedBudget = wrapper.vm.formatCurrency(mockMovie.budget);
    const formattedRevenue = wrapper.vm.formatCurrency(mockMovie.revenue);
    expect(formattedBudget).toBe('R$ 100.000.000,00');
    expect(formattedRevenue).toBe('R$ 500.000.000,00');
  });

  it('navigates back to home when "Voltar" button is clicked', async () => {
    const goBackButton = wrapper.find('button');
    await goBackButton.trigger('click');
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith({ name: 'home' });
  });
});
