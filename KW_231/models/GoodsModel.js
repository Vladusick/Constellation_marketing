import { isThisISOWeek } from 'date-fns'
import { MainProvider } from '../providers/MainProvider'

/**
 * Параметры запуска модуля
 * @typedef {Object} KW231Params
 * @property {string} branch_id - Идентификатор филлиала
 * @property {string} branch - Филлиал
 * @property {string} type_id - Идентификатор типа мероприятия
 * @property {string} marketing_type - Тип мероприятия
 */
export const GoodsModel = {

  create: function () {
    return this
  },

  events: {
    GOODS_REQUESTED: new ApplicationEvent(),
    GOODS_REFRESHED: new ApplicationEvent(),
    GOODS_REFRESH_FAILED: new ApplicationEvent(),
    GOODS_REQUEST_FINISHED: new ApplicationEvent(),
    IS_ORDER_REQUESTED: new ApplicationEvent(),
    IS_ORDER_REFRESHED: new ApplicationEvent(),
    IS_ORDER_REFRESH_FAILED: new ApplicationEvent(),
    IS_ORDER_REQUEST_FINISHED: new ApplicationEvent(),
  },

  params: {},

  goods_title_ids: [],

  is_show_unattached: 0,

  labels: {
    branch: '',
    marketing_type: '',
    count_constellation: 0,
    count_attached: 0,
    count_unattached: 0
  },

  goods: [],

  counters: {},

  filter_text: '',

  get_params() {
    return this.params
  },

  set_params(params) {
    this.params = params
    this.goods_title_ids = this.params.marketing_type
    this.labels.branch = this.params.branch
    this.labels.marketing_type = this.params.marketing_type

  },

  async load_goods() {
    this.events.GOODS_REQUESTED.notify()
    try {
      const result = await MainProvider.get_goods(this.params)
      this.goods = result[0]
      this.counters = result[1][0]
      this.calculate_count_labels()
      this.events.GOODS_REFRESHED.notify(this.get_filtered_goods())
    } catch (e) {
      this.events.GOODS_REFRESH_FAILED.notify(e)
    } finally {
      this.events.GOODS_REQUEST_FINISHED.notify()
    }
  },

  async change_is_order(item) {
    const param = {
      reg_id: item.reg_id,
      branch_id: this.params.branch_id,
      action_id: item.action_id,
      product_id: item.product_id,
      nomenclature_id: item.nomenclature_id,
      is_order: item.is_order
    }
    this.events.IS_ORDER_REQUESTED.notify()
    try {
      await MainProvider.change_is_order(param)
      this.events.IS_ORDER_REFRESHED.notify()
    } catch (e) {
      this.events.IS_ORDER_REFRESH_FAILED.notify(e)
    } finally {
      this.events.IS_ORDER_REQUEST_FINISHED.notify()
    }
  },

  get_goods_title_ids() {
    return this.goods_title_ids
  },

  get_labels() {
    return this.labels
  },

  calculate_count_labels() {
    this.labels.count_constellation = this.counters.second_level
    this.labels.count_attached = this.counters.third_level
    this.labels.count_unattached = this.counters.is_unattached

  },

  //сам чек бокс при нажатии вызывется метод
  set_is_show_unattached(is_show_unattached) {
    this.is_show_unattached = is_show_unattached
  },

  //фильтрация почекбоксу
  get_filtered_goods() {
    let text_filtered_goods = this.get_text_filtered_goods()
    // проверка нажат ли чекбокс
    if (this.is_show_unattached) {
      return JSON.parse(JSON.stringify(text_filtered_goods))
    } else {
      let filtered_goods = []
      for (let item of text_filtered_goods) {
        //если 1 то товар привязанный, если 0 то нет
        if (item.is_attached === '1')
          filtered_goods.push(item)
      }
      return JSON.parse(JSON.stringify(filtered_goods))
    }
  },

  set_filter_text(filter_text) {
    this.filter_text = filter_text
  },

  do_filtering() {
    this.events.GOODS_REFRESHED.notify(this.get_filtered_goods())
  },

  //фильтрация по поисковой строке
  get_text_filtered_goods() {
    if (!this.filter_text) return this.goods
    let text_filtered_goods = []
    for (let item of this.goods) {
      if (objUtils.func_is_contains(this.filter_text, item, 'product_id', 'nomenclature_name'))
        text_filtered_goods.push(item)
    }
    return text_filtered_goods
  }
}