import {MarketProgramsModel} from '../models/MarketProgramsModel'

export const MarketProgramsTable = {

  create() {
    this.models = {
      market_programs: MarketProgramsModel.create(),
    }
    return this
  },

  render() {
    let columns = [
      objUI.table_column({id: 'branch', header: KW_230.lcl.branch, minWidth: 350}),
      objUI.table_column({
        id: 'marketing_action_name',
        header: KW_230.lcl.marketingType,
        minWidth: 350,
        template: this.make_marketing_icon,
        tooltip: this.make_marketing_tooltip,
      }),
      objUI.table_column_datetime({id: 'date_modify', header: KW_230.lcl.lastUploadDate, minWidth:300})
    ]
    return {
      id: this.id = objUtils.uid(),
      rows: [
        objUI.datatable({
          localId: 'market_programs_table',
          columns,
          bottom_toolbar: {
            search: {
              columns: [
                'branch',
              ]
            },
          }
        }),
      ]
    }
  },

  init() {
    objUI.extend_with_local_id_on_destination(this, this.root = $$(this.id))

    this.elements = {
      table: this.$$('market_programs_table'),
      open_recommended_suppliers_button: this.$$('open_recommended_suppliers_button')
    }

    this.models.market_programs.events.PROGRAMS_REQUESTED.subscribe(() => {
      this.elements.table.clearAll()
      objUI.show_progress(this.elements.table)
    })

    this.models.market_programs.events.PROGRAMS_REQUEST_FINISHED.subscribe(() => {
      objUI.hide_progress(this.elements.table)
    })

    this.models.market_programs.events.PROGRAMS_REFRESHED.subscribe((market_programs) => {
      this.elements.table.define_default(market_programs)
      market_programs.length && this.elements.table.select(this.elements.table.getFirstId())   
    })

    this.elements.table.attachEvent('onItemDblClick', () => {
      this.models.market_programs.open_goods_list_for_selected_program()
    })

    this.elements.table.attachEvent('onAfterSelect', () => {
      let selected_item = this.elements.table.getSelectedItem()
      selected_item && this.models.market_programs.set_selected_program(selected_item)    
    })    
  },

  make_marketing_icon: item => objUI.func_text_with_icon(KW_230.MARKETING_KEYS[item.marketing_type], [{img: true, link: KW_230.MARKETING_ICONS[item.marketing_type]}]),

  make_marketing_tooltip(item) {
    let str = `<div style="width:100%;display:flex;justify-content:flex-start;align-items:center;"><img src="
      ${KW_230.MARKETING_ICONS[item.marketing_type]}" style="width:15px;height:15px;margin-right:5px"/>
      ${KW_230.MARKETING_KEYS[item.marketing_type]}</div>`
    return str      
  }
}