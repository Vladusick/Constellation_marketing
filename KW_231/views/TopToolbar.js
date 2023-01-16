import {GoodsModel} from '../models/GoodsModel'

export const TopToolbar = {

  create() {
    this.models = {
      goods: GoodsModel.create()
    }
    return this
  },

  render() {
    return {
      id: this.id = objUtils.uid(),
      rows: [
        objUI.toolbar_horizontal([
          {
            rows: [
              {
                cols: [
                  objUI.label_bold({ label: KW_231.lcl.top_toolbar.branch}),
                  objUI.label({ localId:'branch_lbl', width: 250 }),
                ]
              },
              {
                cols: [
                  objUI.label_bold({ label: KW_231.lcl.top_toolbar.marketing_type}),
                  objUI.label({ localId:'marketing_type_lbl', width: 250 }),
                ]
              }            
            ]
          },
          {},
          {
            rows: [
              {
                cols: [
                  {},
                  objUI.label({ label: KW_231.lcl.top_toolbar.amount_goods_constellation }),
                  objUI.label_bold({ localId:'amount_goods_constellation_lbl', width: 40 }),
                ]
              },
              {
                cols: [
                  {},
                  objUI.label({ label: KW_231.lcl.top_toolbar.amount_attached_goods_constellation_total }),                  
                  objUI.label_bold({ localId:'amount_attached_goods_constellation_total_lbl', width: 40 }),
                ]
              },
              {
                cols: [
                  {},
                  objUI.label({ label: KW_231.lcl.top_toolbar.amount_unattached_goods_constellation }),
                  objUI.label_bold({ localId:'amount_unattached_goods_constellation_lbl', width: 40 }),
                ]
              },
            ]
          },
          { width: 5 },
          {
            rows: [
              {},
              {},
              objUI.checkbox({
                localId: 'is_show_unattached',
                labelRight: KW_231.lcl.top_toolbar.is_show_unattached 
              })
            ]
          }          
        ])
      ]
    }
  },

  init() {
    objUI.extend_with_local_id_on_destination(this, this.root = $$(this.id))

    this.elements = {
      branch_label: this.$$('branch_lbl'),
      marketing_type_label: this.$$('marketing_type_lbl'),
      amount_goods_constellation_label: this.$$('amount_goods_constellation_lbl'),
      amount_attached_goods_constellation_total_label: this.$$('amount_attached_goods_constellation_total_lbl'),
      amount_unattached_goods_constellation_label: this.$$('amount_unattached_goods_constellation_lbl'),
      is_show_unattached: this.$$('is_show_unattached')
    }

    this.elements.is_show_unattached.attachEvent('onChange', is_show_unattached => {
      this.models.goods.set_is_show_unattached(is_show_unattached)
      this.models.goods.do_filtering()
    })

    this.models.goods.events.GOODS_REQUEST_FINISHED.subscribe(() => {
      let labels = this.models.goods.get_labels()
      this.elements.branch_label.setValue(labels.branch)
      this.elements.marketing_type_label.setValue(labels.marketing_type)
      this.elements.amount_goods_constellation_label.setValue(labels.count_constellation)
      this.elements.amount_attached_goods_constellation_total_label.setValue(labels.count_attached)
      this.elements.amount_unattached_goods_constellation_label.setValue(labels.count_unattached)
    })
  },
}