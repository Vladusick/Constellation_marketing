import {MainProvider} from '../providers/MainProvider'

export const MarketProgramsModel = {

  create: function () {
    return this
  },

  events: {
    PROGRAMS_REQUESTED: new ApplicationEvent(),
    PROGRAMS_REFRESHED: new ApplicationEvent(),
    PROGRAMS_REFRESH_FAILED: new ApplicationEvent(),
    PROGRAMS_REQUEST_FINISHED: new ApplicationEvent(),
    SELECTED_PROGRAM_CHANGED: new ApplicationEvent()
  },

  programs: [],

  selected_program: {},

  branch_ids: [],

  filter_title_ids: [],

  filter_text: '',

  async load_programs() {
    this.events.PROGRAMS_REQUESTED.notify()
    try {
      this.programs = await MainProvider.get_programs({
        branches: this.branch_ids
      })
      this.events.PROGRAMS_REFRESHED.notify(this.programs)
    } catch (e) {
      this.events.PROGRAMS_REFRESH_FAILED.notify()
    } finally {
      this.events.PROGRAMS_REQUEST_FINISHED.notify()
    }
  },

  get_selected_program() {
    return this.selected_program
  },

  set_selected_program(selected_program) {
    this.selected_program = selected_program
    this.events.SELECTED_PROGRAM_CHANGED.notify(this.selected_program)
  },

  set_branch_ids(branch_ids) {
    this.branch_ids = branch_ids
  },

  refresh_with_filter() {
    this.set_selected_program({})
    this.events.PROGRAMS_REFRESHED.notify(this.get_filtered_programs())
  },

  get_filtered_programs() {
    if(!this.filter_title_ids) return this.programs
    let filtered_programs = []
    for(let program of this.programs) {
      if (this.filter_title_ids.indexOf(program.marketing_type) !== -1)
        filtered_programs.push(program)
    }
    return filtered_programs
  },

  set_filter_title_ids(filter_title_ids) {
    this.filter_title_ids = filter_title_ids
  },

  open_goods_list_for_selected_program() {
    ModuleManager.open_module({
      name: 'KW_231',
      param: {
        marketing_type: KW_230.MARKETING_KEYS[this.selected_program.marketing_type],
        branch_id: this.selected_program.branch_id,
        marketing_type_action: this.selected_program.marketing_type,
        branch: this.selected_program.branch,
      }
    }).then()
  },
}