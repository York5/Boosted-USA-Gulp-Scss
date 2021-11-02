const { src, dest } = require('gulp');
const gulp = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const csso = require('gulp-csso');
const fileinclude = require('gulp-file-include');
const htmlmin = require('gulp-htmlmin');
const del = require('del');
// browsersync - плагин который обновляет страницу
const browsersync = require('browser-sync').create();
// autoprefixer - плагин который автоматически рисует vendor префиксы для различных браузеров.
const autoprefixer = require('gulp-autoprefixer');
const group_media = require('gulp-group-css-media-queries');
// clean-css - сжимает css для оптимизации
const clean_css = require('gulp-clean-css');
// rename переименовывает файл
const rename = require('gulp-rename');
// uglify - плагин который минимизирует js файлы
const uglify = require('gulp-uglify-es').default;
// imagemin - плагин для сжатия изображений без потери качества
const imagemin = require('gulp-imagemin');
//webp - плагин для конвертации изображений в современный плагин webp
const webp = require('gulp-webp');
// плагин автоматически преобразует картинки в html и применяет либо webp либо jpeg
const webphtml = require('gulp-webp-html');
const webpcss = require('gulp-webp-css');
const svgSprite = require('gulp-svg-sprite');

// Называем dist папку которая в конце будет собрана и будет передаваться заказчику.
let project_folder = require('path').basename(__dirname);
// Папка с исходниками
let source_folder = 'src';

// Прописываем все пути
let path = {
  // В build пишем пути как будет выглядить конечная структура собранного проекта которую отдаем заказчику.
  build: {
    html: project_folder + '/',
    css: project_folder + '/css/',
    js: project_folder + '/js/',
    img: project_folder + '/img/',
  },
  // В src пишем пути где у нас сейчас что находится
  src: {
    html: [source_folder + '/*.html', '!' + source_folder + '/_*.html'],
    css: source_folder + '/scss/style.scss',
    js: source_folder + '/js/script.js',
    img: source_folder + '/img/**/*.{jpg,png,svg,gif,ico,webp}',
  },
  // В watch указываем где за какими файлами именно нужно все время gulp следить
  watch: {
    html: source_folder + '/**/*.html',
    // **/*.html - Значит слушат внутри всего,и слушать все файлы .html
    css: source_folder + '/scss/**/*.scss',
    js: source_folder + '/js/**/*.js',
    img: source_folder + '/img/**/*.{jpg,png,svg,gif,ico,webp}',
  },
  // Путь к папке готового проекта. Этот объект удаляет эту папку каждый раз когда заново запускаем gulp.
  clean: './' + project_folder + '/',
};

// Создаем функцию которая будет обновлять страницу
function browserSync(params) {
  browsersync.init({
    // Настройки плагина
    server: {
      baseDir: './' + project_folder + '/',
    },
    port: 3000,
    notify: false,
  });
}

// Функция для работы с html файлами
function html() {
  return (
    src(path.src.html)
      // Подключаем плагин для соединения различных файлов и страниц в проекте
      .pipe(fileinclude())
      // .pipe(webphtml())
      // указываем в какую папку записывать финальный билд htlm
      .pipe(dest(path.build.html))
      // обновляем страницу
      .pipe(browsersync.stream())
  );
}

// Функция для работы с css файлами
function css() {
  return (
    src(path.src.css)
      .pipe(
        scss({
          outputStyle: 'expanded',
        })
      )
      .pipe(
        autoprefixer({
          overrideBrowserslist: ['last 5 versions'],
          cascade: true,
        })
      )
      // .pipe(webpcss())
      .pipe(group_media())
      .pipe(dest(path.build.css))
      // сжимаем сss файл
      .pipe(clean_css())
      // переименовываем
      .pipe(
        rename({
          extname: '.min.css',
        })
      )
      // указываем в какую папку записывать финальный билд css
      .pipe(dest(path.build.css))
      // обновляем страницу
      .pipe(browsersync.stream())
  );
}

function js() {
  return (
    src(path.src.js)
      // Подключаем плагин для соединения различных файлов и страниц в проекте
      .pipe(fileinclude())
      // сжимаем js файл
      .pipe(uglify())
      .pipe(dest(path.build.js))
      .pipe(
        rename({
          extname: '.min.js',
        })
      )
      // указываем в какую папку записывать финальный билд htlm
      .pipe(dest(path.build.js))
      // обновляем страницу
      .pipe(browsersync.stream())
  );
}

function images() {
  return (
    src(path.src.img)
      // .pipe(
      //   webp({
      //     quality: 70,
      //   })
      // )
      // .pipe(dest(path.build.img))
      // .pipe(src(path.src.img))
      .pipe(
        imagemin({
          progressive: true,
          svgoPlugins: [{ removeViewBox: false }],
          interlaced: true,
          optimizationLevel: 3, //0 t0 7
        })
      )
      .pipe(dest(path.build.img))
      // обновляем страницу
      .pipe(browsersync.stream())
  );
}

// Пример создания спрайтов
// gulp.task('svgSprite', function () {
//   return gulp
//     .src([source_folder + '/iconsprite/*.svg'])
//     .pipe(
//       svgSprite({
//         mode: {
//           stack: {
//             sprite: '../icons/icons.svg', // sprite file name
//           },
//         },
//       })
//     )
//     .pipe(dest(path.build.img));
// });
// вызываем через gulp svgSprite

// Функция для автоматического обновления страницы если что то изменилось в html.
function watchFiles(params) {
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.img], images);
}

// Функция которая удаляет билд папку каждый раз перед новым запуском
function clean(params) {
  return del(path.clean);
}

// включаем функции в процесс выполнения(параллельно)
let build = gulp.series(clean, gulp.parallel(js, css, html, images));
let watch = gulp.parallel(build, browserSync, watchFiles);

// сообщаем gulp о наших переменных
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;

// =====================================
