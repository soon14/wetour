export function phoneYz(phone){
	var reg=/^[1][3,4,5,6,7,8,9][0-9]{9}$/;
	if (!reg.test(phone)) {
		return false;
	} else {
		return true;
	}
}

export function cardYz(card){
	var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
	if (!reg.test(card)) {
		return false;
	} else {
		return true;
	}
}