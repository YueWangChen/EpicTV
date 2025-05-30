// 获取当前URL的参数，并将它们传递给player.html
window.onload = function() {
    // 获取当前URL的查询参数
    const currentParams = new URLSearchParams(window.location.search);
    
    // 创建player.html的URL
    let playerUrl = "player.html";
    
    // 更新状态文本
    const manualRedirect = document.getElementById('manual-redirect');
    
    // 如果有查询参数，添加到player.html的URL
    if (currentParams.toString()) {
        playerUrl += "?" + currentParams.toString();
    }
    
    // 获取来源URL (如果存在)
    const referrer = document.referrer;
    
    // 获取当前URL中的返回URL参数（如果有）
    const backUrl = currentParams.get('back');
    
    // 确定返回URL的优先级：1. 指定的back参数 2. referrer 3. 搜索页面
    let returnUrl = '';
    if (backUrl) {
        // 有显式指定的返回URL
        returnUrl = decodeURIComponent(backUrl);
    } else if (referrer && (referrer.includes('/s=') || referrer.includes('?s='))) {
        // 来源是搜索页面
        returnUrl = referrer;
    } else if (referrer && referrer.trim() !== '') {
        // 如果有referrer但不是搜索页，也使用它
        returnUrl = referrer;
    } else {
        // 默认回到首页
        returnUrl = '/';
    }
    
    // 将返回URL添加到player.html的参数中
    const separator = playerUrl.includes('?') ? '&' : '?';
    playerUrl += separator + 'returnUrl=' + encodeURIComponent(returnUrl);
    
    // 同时保存在localStorage中，作为备用
    localStorage.setItem('lastPageUrl', returnUrl);
    
    // 标记来自搜索页面
    if (returnUrl.includes('/s=') || returnUrl.includes('?s=')) {
        localStorage.setItem('cameFromSearch', 'true');
        localStorage.setItem('searchPageUrl', returnUrl);
    }
    
    // 更新手动重定向链接
    if (manualRedirect) {
        manualRedirect.href = playerUrl;
    }
    
    // 重定向到播放器页面
    setTimeout(() => {
        window.location.href = playerUrl;
    }, 1000); // 稍微早于meta refresh的时间，确保我们的JS控制重定向
};
