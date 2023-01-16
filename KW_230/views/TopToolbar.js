import {MarketProgramsModel} from '../models/MarketProgramsModel'

export const TopToolbar = {

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
          objUI.combo_branches({
            localId: 'branches_combo',
            selected_all: true,
          }),
          objUI.icon_btn_refresh({localId: 'refresh_button'}),
          objUI.selector({
            localId: 'filter_selector',
            label: KW_230.lcl.filter,
            labelWidth: 130,
            width: 400,
            popupWidth: 400,
            should_select_all: true,
            multiselect: 'touch',
            adapter: item => ({
              id: String(item.id),
              value: item.value,
            }),
            mapper: items => items.map(item => item.value),
            loader: () => this.get_items_for_filter_selector(),
            on_change: this.set_filter_title_ids_and_refresh_with_filter
          }),
          {}
        ])
      ]
    }
  },

  init() {
    objUI.extend_with_local_id_on_destination(this, this.root = $$(this.id))

    this.elements = {
      branches_combo: this.$$('branches_combo'),
      refresh_button: this.$$('refresh_button'),
      filter_selector: this.$$('filter_selector'),
    }

    this.elements.refresh_button.attachEvent('onItemClick', () => {
      this.models.market_programs.load_programs().then()
    })

    this.elements.branches_combo.attachEvent('onChange', ids => {
      this.models.market_programs.set_branch_ids(ids)
      this.models.market_programs.load_programs().then()
    })
  },

  get_items_for_filter_selector() {
    return new Promise((resolve) => {
      this.models.market_programs.events.PROGRAMS_REFRESHED.subscribe((programs) => {
        let items = []
        for (let program of programs) {
          items.push({
            id: program.marketing_type,
            value: KW_230.MARKETING_KEYS[program.marketing_type],
          })
        }
        resolve(items)
      })
    })
  },

  set_filter_title_ids_and_refresh_with_filter(ids) {
    KW_230.models.market_programs.set_filter_title_ids(ids)
    KW_230.models.market_programs.refresh_with_filter()
  }
}