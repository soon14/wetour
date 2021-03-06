/**
 * 处理富文本里的图片宽度自适应
 * 1.去掉img标签里的style、width、height属性
 * 2.修改所有style里的width属性为max-width:100%
 * 3.img标签添加style属性：max-width:100%;height:auto
 * 4.去掉<br/>标签
 * @param html
 * @return string
 */
function formatRichText (html) {
	// 去掉img标签里的style、width、height属性
	let newContent= html.replace(/<img[^>]*>/gi,function(match,capture){
		match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
		match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
		match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
		return match;
	});
	// 修改所有style里的width属性为max-width:100%
	newContent = newContent.replace(/style="[^"]+"/gi,function(match,capture){
		match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi, 'max-width:100%;');
		return match;
	});
	// 去掉<br/>标签
	newContent = newContent.replace(/<br[^>]*\/>/gi, '');
	// img标签添加style属性：max-width:100%;height:auto
	newContent = newContent.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;margin:0px auto 5px;"');
	return newContent;
}

export default {
	formatRichText,
};