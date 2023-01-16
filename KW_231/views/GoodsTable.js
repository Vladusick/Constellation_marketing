import {GoodsModel} from '../models/GoodsModel'

export const GoodsTable = {

  create() {
    this.models = {
      goods: GoodsModel.create(),
    }
    return this
  },

  render() {
    return {
      id: this.id = objUtils.uid(),
      rows: [
        objUI.treetable({
          localId: 'goods_treetable',
          sort: 'multi',
          columns: [
            ...this.make_common_columns(),
          ],               
        }),
        objUI.toolbar_horizontal([
          objUI.search_field({localId: 'search_field', func: this.search_field_changed, type_search: true}),
          {}
        ])
      ]
    }
  },

  init() {
    objUI.extend_with_local_id_on_destination(this, this.root = $$(this.id))

    this.elements = {
      treetable: this.$$('goods_treetable'),
      search_field: this.$$('search_field')
    }

    this.elements.treetable.attachEvent('onCheck', (row) => {
      this.models.goods.change_is_order(this.elements.treetable.getItem(row))
    })

    this.elements.search_field.attachEvent('onTimedKeyPress', () => {
      this.search_field_changed(this.elements.search_field.getValue())
    })

    this.models.goods.events.GOODS_REQUESTED.subscribe(() => {
      this.elements.treetable.clearAll()

      objUI.show_progress(this.elements.treetable)
    })

    this.models.goods.events.GOODS_REQUEST_FINISHED.subscribe(() => {
      objUI.hide_progress(this.elements.treetable)
    })

    this.models.goods.events.GOODS_REFRESHED.subscribe((goods) => {
      //цикл по второй процедуре
      this.elements.treetable.define_default(goods)
    })

    this.models.goods.events.IS_ORDER_REQUESTED.subscribe(() => {
      objUI.show_progress(this.elements.treetable)
    })

    this.models.goods.events.IS_ORDER_REQUEST_FINISHED.subscribe(() => {
      objUI.hide_progress(this.elements.treetable)
    })
  },

  make_common_columns() {
    return [
      objUI.table_column_checkbox({
        id: 'is_order',
        header: KW_231.lcl.treetable.not_order,
        width: 130,
        template: this.add_checkbox_inside_the_cell,
        cssFormat: this.add_style_to_item_cell
      }),
      objUI.table_column({
        id: 'product_id',
        header: KW_231.lcl.treetable.product_id,
        width: 90,
        template: this.change_field_product_id_by_levels,
        cssFormat: this.add_style_to_item_cell
      }),
      objUI.table_column({
        id: 'nomenclature_name',
        header: KW_231.lcl.treetable.name,
        fillspace: true,
        cssFormat: this.add_style_to_item_cell
      }),
      objUI.table_column({
        id: 'fabr',
        header: KW_231.lcl.treetable.fabricator,
        width: 240,
        cssFormat: this.add_style_to_item_cell
      }),
      objUI.table_column_int({
        id: 'quantity',
        header: KW_231.lcl.treetable.plan_pack,
        width: 60,
        cssFormat: this.add_style_to_item_cell,
        decimal: 0 
      }),
      objUI.table_column_num({
        id: 'cip',
        header: KW_231.lcl.treetable.CIP_price,
        width: 100,
        cssFormat: this.add_style_to_item_cell,
        decimal: 2,
        template: item => item.cip === 0 ? 0 : item.$level === 1 ? item.cip : ''
      }),
      objUI.table_column_num({
        id: '',
        header: KW_231.lcl.treetable.bonus,
        width: 120,
        cssFormat: this.add_style_to_item_cell
      }),
      objUI.table_column_num({
        id: 'qnt_ost',
        header: KW_231.lcl.treetable.current_balance,
        width: 120,
       template: this.change_field_qnt_ost_by_levels,
        cssFormat: this.add_style_to_item_cell
      }),
      objUI.table_column_date({
        id: 'date_start',
        header: KW_231.lcl.treetable.date_of_begin,
        width: 120,
        cssFormat: this.add_style_to_item_cell
      }),
      objUI.table_column_date({
        id: 'date_end',
        header: KW_231.lcl.treetable.date_of_end,
        width: 120,
        cssFormat: this.add_style_to_item_cell
      }),
      objUI.table_column({
        id: 'action_id',
        header: KW_231.lcl.treetable.promotion_code,
        width: 80,
        cssFormat: this.add_style_to_item_cell,
        template: item => item.$level !== 3 ? item.action_id : ''
      }),
      objUI.table_column({
        id: 'marketing_action_name',
        header: KW_231.lcl.treetable.action_name,
        minWidth: 80,
        cssFormat: this.add_style_to_item_cell,
      }),
      objUI.table_column({
        id: 'cnt',
        header: KW_231.lcl.treetable.permitted_supplyers,
        minWidth: 80,
        cssFormat: this.add_style_to_item_cell,
        template: item => item.cnt === 0 ? 'Отсутствует' : item.$level === 1 ? item.cnt : ''
      })
    ]
  },
  
  add_style_to_item_cell(_, item) {
    if(item.$level === 3) {
      return 'green_bg'
    }
    if (item.is_attached === '0') {
      return 'light_red_bg'
    }
  },

  add_checkbox_inside_the_cell(obj, common, value, config) {
    if (obj.$level === 3) {
      return common.treetable(obj, common) + common.checkbox(obj, common, value, config)
    }
    return common.treetable(obj, common)
  },

  change_field_product_id_by_levels(obj) {
    switch (obj.$level) {
      case 1: return obj.product_id
      case 2: return obj.nomenclature_id
      case 3: return obj.reg_id
    }
  },

  change_field_qnt_ost_by_levels(obj) {
    switch (obj.$level) {
      case 1: return obj.total_ost
      case 2: return obj.total_ost
      case 3: return obj.qnt_ost
    }
  },

  search_field_changed(value) {
    KW_231.models.goods.set_filter_text(value)
    KW_231.models.goods.do_filtering()
  }
}