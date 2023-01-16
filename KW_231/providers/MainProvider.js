export const MainProvider = {
  get_goods: (param) => objGlobal.func_cbd_request({
    proc_name: '231_1_v1',
    show_no_access_warning: false,
    param
  }).then(result => result),

  change_is_order: (param) => objGlobal.func_post_json({
    procName: '231_2_v1',
    procType: 'wo',
    param
  })
}