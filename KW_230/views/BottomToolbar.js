import {MarketProgramsModel} from "../models/MarketProgramsModel";

export const BottomToolbar = {

  create() {
    this.models = {
      market_programs: MarketProgramsModel.create()
    }
    return this
  },

  render() {
    return {
      id: this.id = objUtils.uid(),
      rows: [
        objUI.toolbar_horizontal([
          objUI.search_field({localId: 'search_field', func: () => {}, type_search: true}),
          {}
        ])
      ]
    }
  },

  init() {
    objUI.extend_with_local_id_on_destination(this, this.root = $$(this.id))

    this.elements = {
      search_field: this.$$('search_field')
    }

    this.elements.search_field.attachEvent('onTimedKeyPress', () => {
      this.search_field_changed(this.elements.search_field.getValue())
    })
  },

  search_field_changed(value) {
    KW_230.views.market_programs_table.filter_table(value)
  }
}