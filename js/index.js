(function flexible(window, document) {
  var docEl = document.documentElement;
  var dpr = window.devicePixelRatio || 1;

  // 调整 body 字体大小
  function setBodyFontSize() {
    if (document.body) {
      document.body.style.fontSize = 12 * dpr + "px";
    } else {
      document.addEventListener("DOMContentLoaded", setBodyFontSize);
    }
  }
  setBodyFontSize();

  // 设置 1rem = viewWidth / 24
  function setRemUnit() {
    var rem = docEl.clientWidth / 24;
    docEl.style.fontSize = rem + "px";
  }
  // 首次设置 rem 单位
  setRemUnit();

  // 页面调整时重设 rem 单位
  window.addEventListener("resize", setRemUnit);
  window.addEventListener("pageshow", function (e) {
    if (e.persisted) {
      setRemUnit();
    }
  });

  // 检测 0.5px 支持
  if (dpr >= 2) {
    var fakeBody = document.createElement("body");
    var testElement = document.createElement("div");
    testElement.style.border = ".5px solid transparent";
    fakeBody.appendChild(testElement);
    docEl.appendChild(fakeBody);
    if (testElement.offsetHeight === 1) {
      docEl.classList.add("hairlines");
    }
    docEl.removeChild(fakeBody);
  }
})(window, document);


// 获取导航栏的高度
const headerHeight = document.querySelector('.header_outer').offsetHeight;

// 导航项点击事件
document.querySelectorAll('.header_inner .nav_list .nav_item').forEach(item => {
  item.addEventListener('click', function (e) {
    const link = this.querySelector('a');
    const targetId = link.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    e.preventDefault();
    if (targetElement) {
      let topPosition = targetElement.getBoundingClientRect().top + window.scrollY;
      if (targetId === '#home') topPosition = -5;
      window.scrollTo({
        top: topPosition,
        behavior: 'smooth'
      });
    }
  });
});

// 首页按钮点击事件
document.querySelector('.container #home .home_main .home_btn').addEventListener('click', function (e) {

  e.preventDefault();
  const targetId = '#about_me';
  const targetElement = document.querySelector(targetId);
  let topPosition = targetElement.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({
    top: topPosition - 100,
    behavior: 'smooth'
  });
});

// 激活相应的导航标签
function activateNavItem(scrollY) {
  const sections = document.querySelectorAll('.nav_to_link');
  let currentActiveIndex = -1;

  sections.forEach((section, index) => {
    const sectionTop = section.offsetTop - headerHeight - 300;
    const sectionHeight = section.offsetHeight;

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      currentActiveIndex = index;
    }
  });

  const navItems = document.querySelectorAll('.header_inner .nav_list .nav_item');
  navItems.forEach(item => item.classList.remove('nav_item_active'));
  if (currentActiveIndex !== -1) {
    navItems[currentActiveIndex].classList.add('nav_item_active');
  }
}

// 滚动事件更新头部样式
function updateHeaderStyle(scrollY) {
  const headInner = document.querySelector('.header_outer .header_inner');
  scrollY ? headInner.classList.add('header_inner_scroll') : headInner.classList.remove('header_inner_scroll');
}
// 监听滚动事件
window.addEventListener('scroll', function () {
  const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
  updateHeaderStyle(scrollY);
  activateNavItem(scrollY);
});



const bullet_allnum = document.querySelector('.container #Forum .Forum_main .send_comment .left ');


// 渲染评论列表
function renderCommentsList(comments_list, range_random) {
  bullet_allnum.innerHTML = `已装载${comments_list.length}条弹幕`;
  if (range_random > 1 || range_random < 0) {
    alert('range_random 必须在 0 到 1 之间');
    return;
  }

  range_random = range_random || 0.5;
  const comments_container = document.querySelector('#Forum .Forum_main .bullet_comments_area');
  const containerHeight = comments_container.clientHeight;
  comments_container.innerHTML = '';

  comments_list.forEach(item => {
    const bullet_comment = document.createElement('div');
    const randomTopPercentage = Math.random() * range_random;
    const randomTop = containerHeight * randomTopPercentage;

    bullet_comment.style.position = 'absolute';
    bullet_comment.style.top = randomTop + 'px';
    bullet_comment.classList.add('bullet_comment');
    bullet_comment.style.animationDelay = Math.random() * 300 + 's';
    // 弹幕模板
    bullet_comment.innerHTML = `
      <div class="bullet_avatar">
          <img src="${item.avatar}" alt="">
      </div>
      <p class="bullet_comment_content">${item.content}</p>
      <div class="bullet_comment_up">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-weidianzan"></use>
        </svg>
        <span class="comment_up_num">${item.comment_up_num}</span>
      </div>
    `;
    comments_container.appendChild(bullet_comment);
  });
}

// 页面加载完成后渲染评论列表
window.addEventListener('load', () => {
  renderCommentsList(comments_list);
});

// 发送评论
let input_text = document.querySelector('.container #Forum .Forum_main .send_comment .right .comment_input');
let send_btn = document.querySelector('.container #Forum .Forum_main .send_comment .right .comment_btn');

async function sendComment() {
  let content = input_text.value.trim();
  if (!content) {
    alert('评论内容不能为空');
    return;
  }

  let newComment = {
    avatar: './assets/avatar.jpg',
    content: content,
    comment_up_num: 0,
    id: new Date().getTime(), // 使用时间戳作为 ID
    name: '游客',
    time: new Date().toLocaleString()
  };

  // 将新评论添加到本地数组中
  comments_list.push(newComment);

  // 重新渲染评论列表
  renderCommentsList(comments_list);

  // 清空输入框
  input_text.value = '';
}

send_btn.addEventListener('click', async function (event) {
  event.preventDefault(); // 确保正确调用 preventDefault

  sendComment();
});







// 主题切换
const theme_btn = document.querySelector('#gooey-switch');
const body = document.querySelector('body');
let isDark = false;

theme_btn.addEventListener('click', function () {
  body.classList.toggle('dark');
  isDark = !isDark;
  const home_desc = document.querySelector('.container #home .home_main .home_desc ');
  home_desc.style.color = isDark ? '#fff' : '#333';
});



// 视频播放功能
const video_list = [
  './assets/video/travel_video_1.mp4',
  './assets/video/travel_video_2.mp4',
  './assets/video/travel_video_3.mp4',
];

let current_video_index = 0;
const preview_btn = document.querySelector('.container #home .travel_video .preview_btn');
const next_btn = document.querySelector('.container #home .travel_video .next_btn');
let current_video = document.querySelector('.container #home .travel_video .travel_video_paly');
// 视频加载完毕后播放
function updateVideo() {
  current_video.src = video_list[current_video_index];
  current_video.load();
}
// 点击播放按钮播放视频
preview_btn.addEventListener('click', function () {
  current_video_index = (current_video_index - 1 + video_list.length) % video_list.length;
  updateVideo();
});
// 点击下一集按钮播放下一集
next_btn.addEventListener('click', function () {
  current_video_index = (current_video_index + 1) % video_list.length;
  updateVideo();
});


// 表单提交功能

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector('.container #contact_me .contact_me_main .contact_me_email .contact_me_form');

  if (form) { // 确保找到了表单
    form.addEventListener('submit', async function (event) {
      event.preventDefault();  // 防止默认的表单提交行为

      const myHeaders = new Headers();
      myHeaders.append("student_number", "s1234567");
      myHeaders.append("uqcloud_zone_id", "e11123c8");

      const formData = new FormData(form);  // 获取表单数据

      console.log({ ...formData }); // 将 FormData 转换成数组来查看内容 
      console.log([...formData]);

      // 将 FormData 转换为普通对象
      const dataObject = Object.fromEntries(formData.entries());
      console.log(dataObject); // 输出普通对象格式



      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: dataObject,
        redirect: "follow"
      };

      try {
        let response = await fetchData(baseURL, requestOptions);
        let responseMessage = await response.text();
        console.log(responseMessage);

        if (!response.ok) {
          document.querySelector('.info_tip').innerHTML = `请求失败，请检查网络连接或联系管理员`;
          document.querySelector('.info_tip').classList.add('info_tip_animate');
          let clearTime = setTimeout(() => {
            document.querySelector('.info_tip').classList.remove('info_tip_animate');
          }, 2000);
        } else {
          document.querySelector('.info_tip').innerHTML = `请求成功: ${responseMessage}`;
          document.querySelector('.info_tip').classList.add('info_tip_animate');
          let clearTime = setTimeout(() => {
            document.querySelector('.info_tip').classList.remove('info_tip_animate');
          }, 2000);
        }
      } catch (error) {
        console.error('请求错误:', error);
        document.querySelector('.info_tip').innerHTML = `请求失败，请检查网络连接或联系管理员`;
        document.querySelector('.info_tip').classList.add('info_tip_animate');
        let clearTime = setTimeout(() => {
          document.querySelector('.info_tip').classList.remove('info_tip_animate');
        }, 2000);
      }
    });
  }
});