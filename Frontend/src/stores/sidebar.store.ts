import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSidebarStore = defineStore('sidebar', () => {
  const isCollapsed = ref<boolean>(
    localStorage.getItem('brighteyes_sidebar_collapsed') === 'true'
  );

  const toggle = () => {
    isCollapsed.value = !isCollapsed.value;
    localStorage.setItem('brighteyes_sidebar_collapsed', String(isCollapsed.value));
  };

  const setCollapsed = (value: boolean) => {
    isCollapsed.value = value;
    localStorage.setItem('brighteyes_sidebar_collapsed', String(value));
  };

  return {
    isCollapsed,
    toggle,
    setCollapsed,
  };
});
