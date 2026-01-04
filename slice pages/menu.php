<!--Start menu-->
<nav>
	<p>Категории</p>
	<menu id="menu-category">
		<?php
			if ( $response = mysqli_query($conn, "SELECT * FROM list_categories") ) {

				while ( [$id_category, $title_category, $name_category] = mysqli_fetch_row($response) ) {
					echo '<li class="menu-item">
								<div class="menu-item-wrap">
									<div class="menu-item-category" data-id-category="'.$id_category.'">
										'.$name_category.'
									</div>
									<div class="menu-item-tick tick">
										<div class="tick__body"></div>
									</div>
								</div>';
		
					if ($answer = mysqli_query($conn, "SELECT * FROM list_subcategories WHERE ".$title_category." = true")) {
						echo '<ul class="subitem">';
						while ( [$id_subcategory, $title_subcategory, $name_subcategory] = mysqli_fetch_row($answer) ) {
							echo '<li 
										class="subitem-link" 
										data-id-subcategory="'.$id_subcategory.'"
										data-id-category="'.$id_category.'"
									>
										'.$name_subcategory.'
									</li>';    
						}
						echo '</ul>';
					}
				}
				echo '</li>';
			}
		?>
	</menu>
</nav>
<script src="/js/menu.js" defer></script>
<!--End menu-->