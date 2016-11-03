var gulp 		 = require('gulp'),
	sass 		 = require('gulp-sass'),
	browserSync  = require('browser-sync'),
	uglify 		 = require('gulp-uglifyjs'),
	cssnano      = require('gulp-cssnano'),
	gulpIf       = require('gulp-if'),
	useref 		 = require('gulp-useref'),
	plumber 	 = require('gulp-plumber'),
	autoprefixer = require('gulp-autoprefixer'),
	del 		 = require('del'),
	imagemin 	 = require('gulp-imagemin'),
	cache 		 = require('gulp-cache'),
	pngquant 	 = require('imagemin-pngquant'),
	spritesmith  = require('gulp.spritesmith'),
	jade 		 = require('gulp-jade');


// build

gulp.task('clean', function(){
	return del.sync('dist');
});

gulp.task('optimazeimg', function(){
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin({
		interlaced: true,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		use: [pngquant()]
	})))
	.pipe(gulp.dest('dist/img'))
});


gulp.task('clearCache', function(){
	return cache.clearAll();
});

gulp.task('useref', function(){
  return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'));
});

gulp.task('copyfonts', function(){
	return gulp.src('app/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'))
});

// usefull 

gulp.task('sprite', function () {
  var spriteData = gulp.src('app/img/sprite/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.scss'
  }));
  return spriteData.pipe(gulp.dest('app/img/sprite'));
});

// general

gulp.task('jade', function(){
	return gulp.src(['app/jade/**/*.jade','!app/jade/**/_*.jade'])
	.pipe(plumber())
	.pipe(jade({
		pretty: true
	}))
	.pipe(gulp.dest('app'))
})

gulp.task('sass', function(){
	gulp.src('app/sass/**/*.scss')
	.pipe(plumber())
	.pipe(sass({
		outputStyle: 'expanded'
	}))
	.pipe(autoprefixer(['last 2 versions', '> 5%', 'Firefox ESR']))
	.pipe(browserSync.reload({stream: true}))
	.pipe(gulp.dest('app/css'))
});

// sync

gulp.task('browser-sync', function(){
	browserSync({
		server: {
			baseDir: 'app'
		}
	});
});

// watch

gulp.task('build', ['clean', 'useref', 'copyfonts', 'optimazeimg'], function(){
});

gulp.task('default', ['browser-sync', 'sass', 'jade'], function(){
	gulp.watch('app/jade/**/*.jade', ['jade']);
	gulp.watch('app/sass/**/*.scss', ['sass']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
});