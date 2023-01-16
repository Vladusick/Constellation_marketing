import {MarketProgramsModel} from './models/MarketProgramsModel'
import {TopToolbar} from './views/TopToolbar'
import {MarketProgramsTable} from './views/MarketProgramsTable'

/**
 * Созвездие. Список мероприятий
 * @namespace
 */
window.KW_230 = {
  // Локализация модуля
  locales: {
    'ru-RU': {
      header: 'Созвездие. Список мероприятий',
      branch: 'Филиал',
      filter: 'Типы мероприятий',
      marketingType: 'Тип мероприятия',
      lastUploadDate: 'Дата последнего изменения',
    }
  },

  MARKETING_KEYS: {
    'MANDATORY_MATRIX' : 'Обязательная матрица',
    'RECOMMENDED_GOODS' : 'Рекомендованный товар',
    'PROCUREMENT' : 'Закупка',
    'PRODUCT_OF_THE_DAY' : 'Товар дня',
    'PRIVATE_LABEL' : 'УСТМ',
  },

  // Иконки маркетинговых программ Созвездия
  MARKETING_ICONS: {
    'MANDATORY_MATRIX' : './img/stars.png',
    'RECOMMENDED_GOODS' : './img/stars2.png',
    'PROCUREMENT' : './img/stars3.png',
    'PRODUCT_OF_THE_DAY' : './img/stars4.png',
    'PRIVATE_LABEL' : './img/stars5.png'
  },

  // Параметры окна
  window_param: {window_maximize: true},

  render() {
    this.views = {
      top_toolbar: TopToolbar.create(),
      market_programs_table: MarketProgramsTable.create(),      
    }

    return {
      id: 'KW_230_body',
      rows: [        
        this.views.top_toolbar.render(),
        this.views.market_programs_table.render(),        
      ]
    }
  },

  init() {
    this.models = {
      market_programs: MarketProgramsModel.create(),
    }

    ComponentManager.init_views(Object.values(this.views))
  },

  destroy() {
    ComponentManager.destroy_views(Object.values(this.views))
  },
}