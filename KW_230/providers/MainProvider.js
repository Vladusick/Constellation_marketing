export const MainProvider = {

  get_programs: param => objGlobal.func_post_json({
    procName: '230_1_v1',
    procType: 'ro',
    param
  }).then(result => result[0]),
}