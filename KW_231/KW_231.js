import {TopToolbar} from './views/TopToolbar'
import {GoodsTable} from './views/GoodsTable'
import {GoodsModel} from './models/GoodsModel'

/**
 * Созвездие. Состав мероприятий
 * @namespace
 */
window.KW_231 = {
  locales: {
    'ru-RU': {
      header: 'Созвездие',
      attached_goods: 'Справочник Фармнет',
      unattached_goods: 'Товары Созвездния без привязок',
      top_toolbar: {
        branch: 'Филиал: ',
        marketing_type: 'Тип мероприятия: ',
        amount_goods_constellation: 'Количество промотоваров Созвездие: ',
        amount_attached_goods_constellation_total: 'Количество товаров Созвездие, всего: ',
        amount_unattached_goods_constellation: 'Количество непривязанных товаров: ',
        is_show_unattached: 'Отображать'
      },
      treetable: {
        not_order: 'Не заказывать',
        product_id: 'Код товара',
        name: 'Наименование',
        fabricator: 'Производитель',
        plan_pack: 'План, уп.',
        CIP_price: 'CIP-цена',
        bonus: 'Бонус, руб. за упаковку',
        current_balance: 'Текущий остаток',
        promotion_code: 'Код акции',
        date_of_begin: 'Дата начала',
        date_of_end: 'Дата окончания',
        action_name: 'Наименование акции',
        permitted_supplyers: 'Разрешенные поставщики'
      }
    }
  },

  // Локальные стили
  css: `.KW_231_attached_goods { color: green; }
        .KW_231_unattached_goods { color: red; }`,

  // Легенда 
  designations: {
    attached_goods: { class: 'KW_231_attached_goods' },
    unattached_goods: { class: 'KW_231_unattached_goods' }
  },

  window_param: {window_maximize: true},

  render() {
    this.views = {
      top_toolbar: TopToolbar.create(),
      goods_table: GoodsTable.create(),
    }

    return {
      id: 'KW_231_body',
      rows: [
        this.views.top_toolbar.render(),
        this.views.goods_table.render(),
      ]
    }
  },

  init(param) {
    this.models = {
      goods: GoodsModel.create(),
    }

    this.models.goods.events.GOODS_REFRESHED.subscribe(() => {
      this.make_headers()
    })

    this.models.goods.set_params(param)

    ComponentManager.init_views(Object.values(this.views))

    this.models.goods.load_goods()
  },

  make_headers() {
    const text = this.lcl.header + '. ' + this.models.goods.get_goods_title_ids()
    objDesktop.func_update_win_caption(this.module_name,  text)
    objDesktop.func_update_button_name(this.module_name, text)
  },

  destroy() {
    ComponentManager.destroy_views(Object.values(this.views))
  }
}