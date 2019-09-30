const browserSync = require('browser-sync').create(),
	del = require('del'),
	env = require('gulp-util').env,
	gulp = require('gulp'),
	handlebars = require('gulp-compile-handlebars'),
	rename = require('gulp-rename'),
	merge = require('gulp-controlled-merge-json');
	// data = require('gulp-data');

const path = {
  src: './src',
  content: './src/**/*.json',
  contentDest: './content',
  dest: './dist',
  watchers: [
    {
      match: ['./src/**/*.hbs', './src/**/*.json'],
      tasks: ['html']
    }
  ]
};

let templateData = {};

gulp.task ('json', () => {
	gulp.src(path.content)
	.pipe(merge('combined.json'))
	.pipe(gulp.dest(path.dest));
});

// gulp.task('html', ['clean', 'json'], () => {
	

//     return gulp.src(`${path.src}/pages/*.hbs`)
//         // .pipe(data(function(file) {
//         //     return require('./content/combined.json');
//         // }))
//         .pipe(handlebars(templateData, {
// 			ignorePartials: true,
// 			batch: [`${path.src}/partials`]
// 		  }))
// 		  .pipe(rename({
// 			extname: '.html'
// 		  }))
// 		  .pipe(gulp.dest(path.dest));
// });

let data = require('./dist/combined.json');

gulp.task('clean', () => del(path.dest));

gulp.task('html', ['clean', 'json'], () => {
  return gulp.src(`${path.src}/pages/*.hbs`)
    .pipe(handlebars( data, {
      ignorePartials: true,
      batch: [`${path.src}/partials`]
    }))
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(gulp.dest(path.dest));
});


gulp.task('serve', () => {
  browserSync.init({
    open: false,
    notify: false,
    files: [`${path.dest}/**/*`],
    server: path.dest
  });
});

gulp.task('watch', () => {
  path.watchers.forEach(item => {
    gulp.watch(item.match, item.tasks);
  });
});

gulp.task('default', ['html'], done => {
  if (env.dev) {
    gulp.start('serve');
    gulp.start('watch');
  }
  done();
});
