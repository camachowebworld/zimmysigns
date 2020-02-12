<?php
$body_class = 'page-books archive';
require LAYOUT_PATH . '/header.php';
?>

<?php
	switch('Books') {
		case 'Books':
			$hero_header_text = 'ASL Books Online';
			$books_and_games_type = 'book';
			$results_array = [
				[
					'link' => SITE_URL . '/books/flax-vs-santa',
					'thumb' => get_directory_uri() . '/imgs/site/archive-thumbs/flax-vs-santa.jpg'
				],
				[
					'link' => SITE_URL . '/books/planet-colors',
					'thumb' => get_directory_uri() . '/imgs/site/archive-thumbs/planet-colors.jpg'
				],
				[
					'link' => SITE_URL . '/books/bayme-pants-the-sun-its-broken',
					'thumb' => get_directory_uri() . '/imgs/site/archive-thumbs/the-sun-its-broken.jpg'
				]
			];
			break;
		case 'Games':
			$hero_header_text = 'ASL Games Online';
			$books_and_games_type = 'game';
			$results_array = [
				[
					'link' => SITE_URL  . '/games/save-the-pig',
					'thumb' => get_directory_uri() . '/imgs/site/archive-thumbs/save-the-pig.jpg'
				]
			];
			break;
		case 'Printables':
			$hero_header_text = 'ASL Printables';
			$books_and_games_type = 'printables';
			break;
	}
?>

<section class="hero hero-Books; ?>" id="Books-particles">
  <h1><?php echo $hero_header_text; ?></h1>
</section>

<!-- nav-simple -->
<?php require TEMPLATE_PARTS_PATH . '/nav-simple.php'; ?>
<!-- nav-simple - end-->


<section class="archive-results">

	<?php foreach($results_array as $key => $value): ?>
		<a class="result result-Books" href="<?php //echo $value['link']; ?>">
			<img class="img-responsive" src="<?php //echo $value['thumb'];; ?>" />
			<span class="books-and-games-type"><?php //echo $books_and_games_type; ?></span>
		</a>
	<?php endforeach; ?>

</section>

<?php require LAYOUT_PATH . '/footer.php';
