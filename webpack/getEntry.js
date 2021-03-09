const path = require("path");
const glob = require("glob");

const getEntry = function (globPath, pathDir) {
  const files = glob.sync(globPath);
  let entries = {},
    entry,
    dirname,
    basename,
    pathname,
    extname;
  for (let i = 0; i < files.length; i++) {
    entry = files[i];

    //console.log(entry);

    dirname = path.dirname(entry);
    extname = path.extname(entry);
    basename = path.basename(entry, extname);
    pathname = path.join(dirname, basename);
    pathname = pathDir
      ? pathname.replace(new RegExp("^" + pathDir), "")
      : pathname;
    entries[pathname.split("/")[0]] = ["./" + entry];

    // const name = entry.match(/src\/js\/pages\/(\S*)\/index.(js|jsx|html)/);
    // // console.log(name);
    // if (name && name instanceof Array){
    //   entries[name[1]] = `./${entry}`;
    // }
  }

  return entries;
};

module.exports = getEntry;
