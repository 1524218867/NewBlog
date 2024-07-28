<template>
    <div>
        <header class="navbar navbar-expand-lg navbar-light responsive-nav">
            <!-- Navbar Toggle -->
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#main-nav"
                aria-controls="main-nav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <!-- Collapsible Navbar -->
            <div class="collapse navbar-collapse" id="main-nav">
                <nav class="navbar-nav mx-auto">
                    <ul class="navbar-nav ulBg">
                        <li class="nav-item"><a class="nav-link" href="#top">Home</a></li>
                        <li class="nav-item"><a class="nav-link" href="#featured">Featured</a></li>
                        <li class="nav-item"><a class="nav-link" href="#projects">Recent Projects</a></li>
                        <li class="nav-item"><a class="nav-link" href="#video">Presentation</a></li>
                        <li class="nav-item"><a class="nav-link" href="#blog">Blog Entries</a></li>
                        <li class="nav-item"><a class="nav-link" href="#contact">Contact Us</a></li>
                    </ul>
                </nav>
            </div>
        </header>


        <!-- <div class="page-content">
            <div class="content-section">
                <div class="section-heading">
                    <h1>Section Title</h1>
                    <em>Subheading</em>
                    <p>Some description or text goes here.</p>
                </div>
               
            </div>
        </div> -->


        <div class="sidebar-navigation hidde-sm hidden-xs">
            <!-- <div class="">
                <a href="#">Sen<em>tra</em></a>
            </div> -->
            <div>
                <!-- 如果用户未登录，显示登录和注册链接 -->
                <div v-if="!isLoggedIn" id="loginSection" class="logo">
                    <div @click="goToLogin" class="glass-container" id="glass">登录</div>
                    <div @click="goToRegister" class="glass-container" id="glass">注册</div>
                </div>

                <!-- 如果用户已登录，显示欢迎信息和注销按钮 -->
                <div v-else id="welcomeSection" class="logo">
                    <span>
                        欢迎, {{ getUser.email }}! <a @click="logout">注销</a>
                    </span>
                </div>
            </div>
            <nav>
                <ul>
                    <li>
                        <a href="#top">
                            <span class="rect"></span>
                            <span class="circle"></span>
                            Home
                        </a>
                    </li>
                    <li>
                        <a href="#featured">
                            <span class="rect"></span>
                            <span class="circle"></span>
                            Featured
                        </a>
                    </li>
                    <li>
                        <a href="#projects">
                            <span class="rect"></span>
                            <span class="circle"></span>
                            Recent Work
                        </a>
                    </li>
                    <li>
                        <a href="#video">
                            <span class="rect"></span>
                            <span class="circle"></span>
                            Presentation
                        </a>
                    </li>
                    <li>
                        <a href="#blog">
                            <span class="rect"></span>
                            <span class="circle"></span>
                            Blog Entires
                        </a>
                    </li>
                    <li>
                        <a href="#contact">
                            <span class="rect"></span>
                            <span class="circle"></span>
                            Contact Us
                        </a>
                    </li>
                </ul>
            </nav>
            <ul class="social-icons">
                <li><a href="#"><i class="fa fa-facebook"></i></a></li>
                <li><a href="#"><i class="fa fa-twitter"></i></a></li>
                <li><a href="#"><i class="fa fa-linkedin"></i></a></li>
                <li><a href="#"><i class="fa fa-rss"></i></a></li>
                <li><a href="#"><i class="fa fa-behance"></i></a></li>
            </ul>
        </div>

        <div class="slider">
            <div class="Modern-Slider content-section" id="top">
                <!-- Item -->
                <div class="item item-1">
                    <div class="img-fill">
                        <div class="image"></div>
                        <div class="info">
                            <div>
                                <h1>Beautiful Template<br>Sentra</h1>
                                <p>Sentra is free Bootstrap CSS Template by templatemo website.<br>
                                    Please share our site link to your friends.</p>
                                <div class="white-button button">
                                    <a href="#featured">Discover More</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- // Item -->
                <!-- Item -->
                <div class="item item-2">
                    <div class="img-fill">
                        <div class="image"></div>
                        <div class="info">
                            <div>
                                <h1>Please tell <br>your friends</h1>
                                <p>Support templatemo by sharing a link to your friends.
                                    <br>Thank you for helping us.
                                </p>

                                <div class="white-button button">
                                    <a href="#featured">Share More</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- // Item -->
                <!-- Item -->
                <div class="item item-3">
                    <div class="img-fill">
                        <div class="image"></div>
                        <div class="info">
                            <div>
                                <h1>Suspendisse suscipit<br>nulla sed</h1>
                                <p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices <br>posuere cubilia
                                    Curae; Sed at massa turpis.</p>

                                <div class="white-button button">
                                    <a href="#featured">Learn More</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- // Item -->
            </div>
        </div>


        <div class="page-content">
            <section id="featured" class="content-section">
                <div class="left">Left</div>
                <div class="right">
                    <div>Right 1</div>
                    <div>Right 2</div>
                    <div>Right 3</div>
                </div>
            </section>
            <section id="projects" class="content-section">

            </section>
            <section id="video" class="content-section">
                <div class="row">
                    <div class="col-md-12">
                        <div class="section-heading">
                            <h1>This is a <em>company</em> presentation.</h1>
                            <p>Praesent pellentesque efficitur magna, sed pellentesque neque malesuada vitae.</p>
                        </div>
                        <div class="text-content">
                            <p>In eget ipsum sed lorem vehicula luctus. Curabitur non dolor rhoncus, hendrerit justo sit
                                amet, vestibulum turpis. Pellentesque id auctor tellus, vel ultricies augue. Duis
                                condimentum aliquet blandit. Fusce rhoncus et eros ut pharetra. Phasellus convallis
                                ultricies ligula ac gravida.</p>
                        </div>
                        <div class="accent-button button">
                            <a href="#blog">Continue Reading</a>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <div class="box-video">
                            <div class="bg-video"
                                style="background-image: url(https://www.17sucai.com/preview/2413762/2021-11-26/boke%20mb/%E2%95%9F%CF%83%E2%95%A6%C2%BC%E2%96%93%E2%8C%90%E2%94%90%E2%95%90/img/photo-1425036458755-dc303a604201?fit=crop&fm=jpg&q=75&w=1000);">
                                <div class="bt-play">Play</div>
                            </div>
                            <div class="video-container">

                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section id="blog" class="content-section">
                <div class="section-heading">
                    <h1>Blog<br><em>Entries</em></h1>
                    <p>Curabitur hendrerit mauris mollis ipsum vulputate rutrum.
                        <br>Phasellus luctus odio eget dui imperdiet.
                    </p>
                </div>
                <div class="section-content">
                    <div class="tabs-content">
                        <div class="wrapper">
                            <ul class="tabs clearfix" data-tabgroup="first-tab-group">
                                <li><a href="#tab1" class="active">July 2018</a></li>
                                <li><a href="#tab2">June 2018</a></li>
                                <li><a href="#tab3">May 2018</a></li>
                                <li><a href="#tab4">April 2018</a></li>
                            </ul>
                            <section id="first-tab-group" class="tabgroup">
                                <div id="tab1">
                                    <ul>
                                        <li>
                                            <div class="item">
                                                <img src="../assets/blog_1.jpg" alt="">
                                                <div class="text-content">
                                                    <h4>Integer ultrices augue</h4>
                                                    <span>25 July 2018</span>
                                                    <p>Nam vel egestas nisi. Nullam lobortis magna at enim venenatis luctus.
                                                        Nam finibus, mauris eu dictum iaculis, dolor tortor cursus quam, in
                                                        volutpat augue lectus sed magna. Integer mollis lorem quis ipsum
                                                        maximus finibus.</p>

                                                    <div class="accent-button button">
                                                        <a href="#contact">Continue Reading</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div class="item">
                                                <img src="../assets/blog_2.jpg" alt="">
                                                <div class="text-content">
                                                    <h4>Cras commodo odio ut</h4>
                                                    <span>16 July 2018</span>
                                                    <p>Nam vel egestas nisi. Nullam lobortis magna at enim venenatis luctus.
                                                        Nam finibus, mauris eu dictum iaculis, dolor tortor cursus quam, in
                                                        volutpat augue lectus sed magna. Integer mollis lorem quis ipsum
                                                        maximus finibus.</p>

                                                    <div class="accent-button button">
                                                        <a href="#contact">Continue Reading</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div class="item">
                                                <img src="../assets/blog_3.jpg" alt="">
                                                <div class="text-content">
                                                    <h4>Sed at massa turpis</h4>
                                                    <span>10 July 2018</span>
                                                    <p>Nam vel egestas nisi. Nullam lobortis magna at enim venenatis luctus.
                                                        Nam finibus, mauris eu dictum iaculis, dolor tortor cursus quam, in
                                                        volutpat augue lectus sed magna. Integer mollis lorem quis ipsum
                                                        maximus finibus.</p>

                                                    <div class="accent-button button">
                                                        <a href="#contact">Continue Reading</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div id="tab2">
                                    <ul>
                                        <li>
                                            <div class="item">
                                                <img src="../assets/blog_3.jpg" alt="">
                                                <div class="text-content">
                                                    <h4>Sed at massa turpis</h4>
                                                    <span>30 June 2018</span>
                                                    <p>Nam vel egestas nisi. Nullam lobortis magna at enim venenatis luctus.
                                                        Nam finibus, mauris eu dictum iaculis, dolor tortor cursus quam, in
                                                        volutpat augue lectus sed magna. Integer mollis lorem quis ipsum
                                                        maximus finibus.</p>

                                                    <div class="accent-button button">
                                                        <a href="#contact">Continue Reading</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div class="item">
                                                <img src="../assets/blog_1.jpg" alt="">
                                                <div class="text-content">
                                                    <h4>Lorem ipsum dolor sit</h4>
                                                    <span>24 June 2018</span>
                                                    <p>Nam vel egestas nisi. Nullam lobortis magna at enim venenatis luctus.
                                                        Nam finibus, mauris eu dictum iaculis, dolor tortor cursus quam, in
                                                        volutpat augue lectus sed magna. Integer mollis lorem quis ipsum
                                                        maximus finibus.</p>

                                                    <div class="accent-button button">
                                                        <a href="#contact">Continue Reading</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div class="item">
                                                <img src="../assets/blog_2.jpg" alt="">
                                                <div class="text-content">
                                                    <h4>Cras commodo odio ut</h4>
                                                    <span>12 June 2018</span>
                                                    <p>Nam vel egestas nisi. Nullam lobortis magna at enim venenatis luctus.
                                                        Nam finibus, mauris eu dictum iaculis, dolor tortor cursus quam, in
                                                        volutpat augue lectus sed magna. Integer mollis lorem quis ipsum
                                                        maximus finibus.</p>

                                                    <div class="accent-button button">
                                                        <a href="#contact">Continue Reading</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div id="tab3">
                                    <ul>
                                        <li>
                                            <div class="item">
                                                <img src="../assets/blog_2.jpg" alt="">
                                                <div class="text-content">
                                                    <h4>Cras commodo odio ut</h4>
                                                    <span>26 May 2018</span>
                                                    <p>Nam vel egestas nisi. Nullam lobortis magna at enim venenatis luctus.
                                                        Nam finibus, mauris eu dictum iaculis, dolor tortor cursus quam, in
                                                        volutpat augue lectus sed magna. Integer mollis lorem quis ipsum
                                                        maximus finibus.</p>

                                                    <div class="accent-button button">
                                                        <a href="#contact">Continue Reading</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div class="item">
                                                <img src="../assets/blog_1.jpg" alt="">
                                                <div class="text-content">
                                                    <h4>Lorem ipsum dolor sit</h4>
                                                    <span>22 May 2018</span>
                                                    <p>Nam vel egestas nisi. Nullam lobortis magna at enim venenatis luctus.
                                                        Nam finibus, mauris eu dictum iaculis, dolor tortor cursus quam, in
                                                        volutpat augue lectus sed magna. Integer mollis lorem quis ipsum
                                                        maximus finibus.</p>

                                                    <div class="accent-button button">
                                                        <a href="#contact">Continue Reading</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div class="item">
                                                <img src="../assets/blog_3.jpg" alt="">
                                                <div class="text-content">
                                                    <h4>Integer ultrices augue</h4>
                                                    <span>8 May 2018</span>
                                                    <p>Nam vel egestas nisi. Nullam lobortis magna at enim venenatis luctus.
                                                        Nam finibus, mauris eu dictum iaculis, dolor tortor cursus quam, in
                                                        volutpat augue lectus sed magna. Integer mollis lorem quis ipsum
                                                        maximus finibus.</p>

                                                    <div class="accent-button button">
                                                        <a href="#contact">Continue Reading</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div id="tab4">
                                    <ul>
                                        <li>
                                            <div class="item">
                                                <img src="../assets/blog_1.jpg" alt="">
                                                <div class="text-content">
                                                    <h4>Lorem ipsum dolor sit</h4>
                                                    <span>26 April 2018</span>
                                                    <p>Nam vel egestas nisi. Nullam lobortis magna at enim venenatis luctus.
                                                        Nam finibus, mauris eu dictum iaculis, dolor tortor cursus quam, in
                                                        volutpat augue lectus sed magna. Integer mollis lorem quis ipsum
                                                        maximus finibus.</p>

                                                    <div class="accent-button button">
                                                        <a href="#contact">Continue Reading</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div class="item">
                                                <img src="../assets/blog_3.jpg" alt="">
                                                <div class="text-content">
                                                    <h4>Integer ultrices augue eu</h4>
                                                    <span>24 April 2018</span>
                                                    <p>Nam vel egestas nisi. Nullam lobortis magna at enim venenatis luctus.
                                                        Nam finibus, mauris eu dictum iaculis, dolor tortor cursus quam, in
                                                        volutpat augue lectus sed magna. Integer mollis lorem quis ipsum
                                                        maximus finibus.</p>

                                                    <div class="accent-button button">
                                                        <a href="#contact">Continue Reading</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div class="item">
                                                <img src="../assets/blog_2.jpg" alt="">
                                                <div class="text-content">
                                                    <h4>Cras commodo odio ut</h4>
                                                    <span>20 April 2018</span>
                                                    <p>Nam vel egestas nisi. Nullam lobortis magna at enim venenatis luctus.
                                                        Nam finibus, mauris eu dictum iaculis, dolor tortor cursus quam, in
                                                        volutpat augue lectus sed magna. Integer mollis lorem quis ipsum
                                                        maximus finibus.</p>

                                                    <div class="accent-button button">
                                                        <a href="#contact">Continue Reading</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </section>
            <section id="contact" class="content-section">
                <div id="map">

                    <!-- How to change your own map point
                           1. Go to Google Maps
                           2. Click on your location point
                           3. Click "Share" and choose "Embed map" tab
                           4. Copy only URL and paste it within the src="" field below
                    -->
                    <iframe src="#" width="100%" height="400px" frameborder="0" style="border:0"
                        allowfullscreen=""></iframe>
                </div>
                <div id="contact-content">
                    <div class="section-heading">
                        <h1>Contact<br><em>Sentra</em></h1>
                        <p>Curabitur hendrerit mauris mollis ipsum vulputate rutrum.
                            <br>Phasellus luctus odio eget dui imperdiet.
                        </p>

                    </div>
                    <div class="section-content">
                        <form id="contact" action="#" method="post">
                            <div class="row">
                                <div class="col-md-4">
                                    <fieldset>
                                        <input name="name" type="text" class="form-control" id="name"
                                            placeholder="Your name..." required="">
                                    </fieldset>
                                </div>
                                <div class="col-md-4">
                                    <fieldset>
                                        <input name="email" type="email" class="form-control" id="email"
                                            placeholder="Your email..." required="">
                                    </fieldset>
                                </div>
                                <div class="col-md-4">
                                    <fieldset>
                                        <input name="subject" type="text" class="form-control" id="subject"
                                            placeholder="Subject..." required="">
                                    </fieldset>
                                </div>
                                <div class="col-md-12">
                                    <fieldset>
                                        <textarea name="message" rows="6" class="form-control" id="message"
                                            placeholder="Your message..." required=""></textarea>
                                    </fieldset>
                                </div>
                                <div class="col-md-12">
                                    <fieldset>
                                        <button type="submit" id="form-submit" class="btn">Send Message Now</button>
                                    </fieldset>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
            <section class="footer">
                <p>Copyright &copy; 2021.Company name All rights reserved.<a target="_blank"
                        href="https://sc.chinaz.com/moban/">&#x7F51;&#x9875;&#x6A21;&#x677F;</a></p>
            </section>
            <button class="btn btn-primary">Primary Button</button>
            <ForActicle></ForActicle>
        </div>

    </div>
</template>

<script>

// // import 'popper.js';
// import $ from 'jquery';

// import '../utils/dist/owl.carousel.min.js';
// import '../utils/dist/assets/owl.carousel.min.css';
import 'slick-carousel';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { mapGetters, mapActions } from 'vuex';

import ForActicle from './ForActicle.vue';




export default {
    data() {
        return {

        }
    },
    props: {


    },
    components: {
        ForActicle
    },

    computed: {
        ...mapGetters(['isLoggedIn', 'getUser'])


    },

    mounted() {


        $(".Modern-Slider").slick({
            // 自动播放
            autoplay: true,
            // 动画速度
            speed: 1000,
            // 显示的幻灯片数量
            slidesToShow: 1,
            // 每次滑动显示的数量
            slidesToScroll: 1,
            // 暂停鼠标悬停
            pauseOnHover: false,
            // 显示导航点
            dots: true,
            // 滑动动画  
            fade: true,
            // 悬停时暂停动画
            pauseOnDotsHover: true,
            // 动画效果
            cssEase: 'linear',
            // fade:true,
            // 是否可拖拽
            draggable: false,
            // 上一页按钮
            prevArrow: '<button class="PrevArrow"></button>',
            // 下一页按钮
            nextArrow: '<button class="NextArrow"></button>',
        });

        //点击按钮隐藏或显示导航
        $('#nav-toggle').on('click', function (event) {
            event.preventDefault();
            $('#main-nav').toggleClass("open");
        });
        //点击导航链接切换内容
        $('.tabgroup > div').hide();
        $('.tabgroup > div:first-of-type').show();
        $('.tabs a').click(function (e) {
            e.preventDefault();
            var $this = $(this),
                tabgroup = '#' + $this.parents('.tabs').data('tabgroup'),
                others = $this.closest('li').siblings().children('a'),
                target = $this.attr('href');
            others.removeClass('active');
            $this.addClass('active');
            $(tabgroup).children('div').hide();
            $(target).show();

        })
        //点击视频增加自动播放
        $(".box-video").click(function () {
            $('iframe', this)[0].src += "&amp;autoplay=1";
            $(this).addClass('open');
        })
        //当导航链接点击时，更新导航栏
        var contentSection = $('.content-section, .main-banner');
        var navigation = $('nav');
        //when a nav link is clicked, smooth scroll to the section
        navigation.on('click', 'a', function (event) {
            event.preventDefault(); //prevents previous event
            smoothScroll($(this.hash));
        });
        //update navigation on scroll...
        $(window).on('scroll', function () {
            updateNavigation();
        })
        //...and when the page starts
        updateNavigation();
        /////FUNCTIONS
        function updateNavigation() {
            contentSection.each(function () {
                var sectionName = $(this).attr('id');
                var navigationMatch = $('nav a[href="#' + sectionName + '"]');
                if (($(this).offset().top - $(window).height() / 2 < $(window).scrollTop()) &&
                    ($(this).offset().top + $(this).height() - $(window).height() / 2 > $(window).scrollTop())) {
                    navigationMatch.addClass('active-section');
                }
                else {
                    navigationMatch.removeClass('active-section');
                }
            });
        }
        function smoothScroll(target) {
            $('body,html').animate({
                scrollTop: target.offset().top
            }, 800);
        }


        //点击按钮隐藏或显示导航

        $('.button a[href*="\\#"]').on('click', function (e) {
            e.preventDefault();
            const target = $(this).attr('href'); // 获取链接的目标锚点
            const offset = $(target).offset();   // 获取目标位置
            if (offset) { // 确保目标存在
                $('html, body').animate({ scrollTop: offset.top - 0 }, 500, 'linear'); // 平滑滚动
            } else {
                console.warn("Target not found for:", target);
            }
        });




        // IndexJs()
        var didScroll;
        // 记录上一次滚动距离
        var lastScrollTop = 0;
        // 每次滚动距离
        var delta = 5;
        // 导航栏高度
        var navbarHeight = $('header').outerHeight();

        // 监听滚动事件
        $(window).scroll(function (event) {
            // 记录已滚动
            didScroll = true;
        });

        // 设置定时器，每隔250毫秒检查一次滚动状态
        setInterval(function () {
            // 如果已滚动，则执行hasScrolled函数
            if (didScroll) {
                hasScrolled();
                // 重置已滚动状态
                didScroll = false;
            }
        }, 250);

        function hasScrolled() {
            // 获取当前滚动条位置
            var st = $(this).scrollTop();


            // 确保他们滚动超过delta
            if (Math.abs(lastScrollTop - st) <= delta)
                return;


            // 如果有导航栏，当滚动到导航栏时，添加类.nav-up.

            // 这对于防止在导航栏之后看到内容是必要的。
            if (st > lastScrollTop && st > navbarHeight) {

                // 向下滚动
                $('header').removeClass('nav-down').addClass('nav-up');
            } else {

                // 向上滚动
                if (st + $(window).height() < $(document).height()) {
                    $('header').removeClass('nav-up').addClass('nav-down');
                }
            }

            // 保存当前滚动条位置
            lastScrollTop = st;
        }
        // 假定一个变量，用于判断用户是否登录
        // 在实际场景中，这个变量可能通过后端API、Cookies、Session等来判断
        let isLoggedIn = false;

        // 获取登录区域的 DOM 元素
        const loginSection = document.getElementById("loginSection");

        // 根据用户状态修改登录区域内容
        if (isLoggedIn) {
            loginSection.innerHTML = "欢迎光临";
        } else {
            loginSection.innerHTML = '<a v-on:click="GoEntry" href="#">登录</a>  <a v-on:click="GoEntry" href="#">注册</a>';
        }


    },
    created() {
        // 在组件创建时从本地存储加载 token 并更新 Vuex 状态
        const token = localStorage.getItem('authToken');
        if (token) {
            this.$store.dispatch('updateUser', { token, details: {} }); // 根据实际情况更新用户信息
        }
    },
    methods: {

        ...mapActions(['logout']),
        goToLogin() {
            this.$router.push('/Entry');
        },
        goToRegister() {
            this.$router.push('/Entry');
        },
        async logout() {
            try {
                alert('退出登录成功');
                await this.$store.dispatch('logout'); // 调用 Vuex 的 logout action
                localStorage.removeItem('authToken'); // 清除本地存储中的 token
                this.$router.push('/Entry'); // 跳转到登录页面
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }
}

</script>
<style></style>
