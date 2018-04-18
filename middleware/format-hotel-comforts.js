var _ = require('lodash');

const formatComforts = (req, res, next) => {
  var comforts = req.body.comforts;

  comforts = _.map(comforts, (comfort) => {
    comfort = comfort.toLowerCase();
    comfort = comfort.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");
    comfort = comfort.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");
    comfort = comfort.replace(/ì|í|ị|ỉ|ĩ/g,"i");
    comfort = comfort.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");
    comfort = comfort.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");
    comfort = comfort.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");
    comfort = comfort.replace(/đ/g,"d");
    comfort = comfort.replace(/!|@|\$|%|\^|\*|∣|\+|\=|\<|\>|\?|\/|,|\.|\:|\'|\"|\&|\#|\[|\]|~/g,"-");
    comfort = comfort.replace(/-+-/g,"-");  //thay thế 2- thành 1-
    comfort = comfort.replace(/^\-+|\-+$/g,"");  //cắt bỏ ký tự - ở đầu và cuối chuỗi
    
    return comfort;
  })
  req.body.comforts = comforts;
  next();  
}

module.exports = { formatComforts };