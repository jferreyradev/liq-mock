import { ref } from 'vue';

const itemsMenu = ref([])

export function useItemsMenu() {

  function setItemsMenu(items) {
    itemsMenu.value = items
  }

  return {
    itemsMenu, setItemsMenu
  };
}