import { createInertiaApp } from '@inertiajs/vue3';
import { createApp, h, type DefineComponent } from 'vue';
import { createPinia } from 'pinia';
import ui from '@nuxt/ui/vue-plugin';
import AppLayout from './Layouts/AppLayout.vue';
import './style.css';

const appName = 'NestJS + Inertia';

createInertiaApp({
  title: (title) => (title ? `${title} - ${appName}` : appName),
  resolve: (name) => {
    const pages = import.meta.glob<DefineComponent>('./Pages/**/*.vue', {
      eager: true,
    });
    const page = pages[`./Pages/${name}.vue`];

    if (!page) {
      throw new Error(`Page not found: ${name}`);
    }

    /* page.default.layout =
      page.default.layout === undefined
        ? ((app: any) => h(AppLayout, {}, () => app))
        : page.default.layout; */

    page.default.layout = page.default.layout || AppLayout;
    return page;
  },
  setup({ el, App, props, plugin }) {
    createApp({ render: () => h(App, props) })
      .use(plugin)
      .use(ui)
      .use(createPinia())
      .mount(el);
  },
});
