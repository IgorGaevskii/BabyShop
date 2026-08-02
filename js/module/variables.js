export const allWindow = document.querySelectorAll('.content'),
	window_mainContent = document.querySelector('.main-content'),
	// page card goods
	btn_favorite = window_mainContent.querySelector('.btn-favorite') || null, //кнопка со страницы купить
	//window new advert
	window_newAdvert = document.querySelector('.new_advert'),
	headingName = window_newAdvert?.querySelector('.header-name'),
	form_newAd = document.forms.new_advert,
	nameGoodsInput = form_newAd?.elements.name_goods,
	priceGoodsInput = form_newAd?.elements.price_goods,
	descriptionGoodsTextarea = form_newAd?.elements.description_goods,
	//window user advert
	window_userAds = document.querySelector('.user_advert'),
	inputHatActiveAds = window_userAds?.querySelector('.active_ads input'),
	inputHatInactiveAds = window_userAds?.querySelector('.inactive_ads input'),
	//window user trading 
	window_userTrading = document.querySelector('.user-trading'),
	but_crossUserTrading = window_userTrading?.querySelector('.header-cross'),
	input_hatMySales = window_userTrading?.querySelector('.my-sales input'),
	input_hatMyPurchases = window_userTrading?.querySelector('.my-purchases input'),
	allBut_deleteTrading = window_userTrading?.querySelectorAll('.but_delete_trading'),
	elem_soldGoodsList = window_userTrading?.querySelector('.sold-goods-list'),
	elem_purchasedGoodsList = window_userTrading?.querySelector('.purchased-goods-list'),
	window_reviewAboutSeller = document.querySelector('.review-about-seller'),
	window_reviewAboutBuyer = document.querySelector('.review-about-buyer'),
	formAuthorization = document.forms.authorizationUser,
	but_authorization = formAuthorization?.querySelector("#but-authorization"),
	input_emailAuthorization = formAuthorization?.querySelector("input[name='email']"),
	input_passwordAuthorization = formAuthorization?.querySelector("input[name='password']"),
	//window ask
	window_ask = document.querySelector('.ask'),
	form_askQuestion = document.forms.ask_question,
	elem_typingArea = form_askQuestion?.elements.typing_area,
	elem_askHeader = window_ask?.querySelector('.ask-header'),
	elem_messagesList = window_ask?.querySelector('.messages'),
	but_crossAsk = window_ask?.querySelector('.header-box-cross'),
	but_sendQuestion = window_ask?.querySelector('.but-send-question'),
	//window chat
	window_chat = document.querySelector('.chat'),
	form_sendMessage = document.forms.send_message,
	elemTextarea_chat = form_sendMessage?.elements.typing_area,
	elemUl_listGoods_chat = window_chat?.querySelector('.list-goods'),
	elemUL_listPartners_chat = window_chat?.querySelector('.list-partners'),
	elemUL_message = window_chat?.querySelector('.list-messages'),
	elemDiv_messagesScreen = window_chat?.querySelector('.messages-screen'),
	elemDiv_headingInfoGoods_chat = window_chat?.querySelector('.heading-info-goods'),
	elemDiv_headingInfoUser_chat = window_chat?.querySelector('.heading-info-user'),
	but_crossChat = window_chat?.querySelector('.header-cross'),
	elemBut_sendMessage_chat = window_chat?.querySelector('.but-send-message'),
	//window favorite
	window_favorites = document.querySelector('.favorites') || null,
	listFavorites = window_favorites ? window_favorites.querySelector('.list-favorites') : null,
	//window cabinet
	window_cabinet = document.getElementById('cabinet'),
	elem_numberNewMessages = window_cabinet?.querySelector('.number-messages'),
	allItemsMenu = document.querySelectorAll('.menu-item'),
	//window popup
	popupModal = document.querySelector('.popup'),
	message = popupModal.querySelector('.message'),
	but_popup = popupModal.querySelector('.but-window');

// console.log(btn_favorite);