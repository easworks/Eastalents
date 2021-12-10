!(function ($) {
  "use strict";

  // Smooth scroll for the navigation menu and links with .scrollto classes
  var scrolltoOffset = $("#header").outerHeight() - 16;
  if (window.matchMedia("(max-width: 991px)").matches) {
    scrolltoOffset += 16;
  }

  // Activate smooth scroll on page load with hash links in the url
  $(document).ready(function () {
    if (window.location.hash) {
      var initial_nav = window.location.hash;
      if ($(initial_nav).length) {
        var scrollto = $(initial_nav).offset().top - scrolltoOffset;
        $("html, body").animate(
          {
            scrollTop: scrollto,
          },
          1500,
          "easeInOutExpo"
        );
      }
    }
  });

  // Mobile Navigation
  if ($(".nav-menu").length) {
    var $mobile_nav = $(".nav-menu").clone().prop({
      class: "mobile-nav d-lg-none",
    });
    $("body").append($mobile_nav);
    $("body").prepend(
      '<button type="button" class="mobile-nav-toggle d-lg-none"><i class="icofont-navigation-menu"></i></button>'
    );
    $("body").append('<div class="mobile-nav-overly"></div>');

    $(document).on("click", ".mobile-nav-toggle", function (e) {
      $("body").toggleClass("mobile-nav-active");
      $(".mobile-nav-toggle i").toggleClass(
        "icofont-navigation-menu icofont-close"
      );
      $(".mobile-nav-overly").toggle();
    });

    $(document).on("click", ".mobile-nav .drop-down > a", function (e) {
      e.preventDefault();
      $(this).next().slideToggle(300);
      $(this).parent().toggleClass("active");
    });

    $(document).click(function (e) {
      var container = $(".mobile-nav, .mobile-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($("body").hasClass("mobile-nav-active")) {
          $("body").removeClass("mobile-nav-active");
          $(".mobile-nav-toggle i").toggleClass(
            "icofont-navigation-menu icofont-close"
          );
          $(".mobile-nav-overly").fadeOut();
        }
      }
    });
  } else if ($(".mobile-nav, .mobile-nav-toggle").length) {
    $(".mobile-nav, .mobile-nav-toggle").hide();
  }

  // Navigation active state on scroll
  var nav_sections = $("section");
  var main_nav = $(".nav-menu, #mobile-nav");

  $(window).on("scroll", function () {
    var cur_pos = $(this).scrollTop() + 200;

    nav_sections.each(function () {
      var top = $(this).offset().top,
        bottom = top + $(this).outerHeight();

      // if (cur_pos >= top && cur_pos <= bottom) {
      //   if (cur_pos <= bottom) {
      //     main_nav.find('li').removeClass('active');
      //   }
      //   main_nav.find('a[href="#' + $(this).attr('id') + '"]').parent('li').addClass('active');
      // }
      // if (cur_pos < 300) {
      //   $(".nav-menu ul:first li:first").addClass('active');
      // }
    });
  });

  // Toggle .header-scrolled class to #header when page is scrolled
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $("#header").addClass("header-scrolled");
    } else {
      $("#header").removeClass("header-scrolled");
    }
  });

  if ($(window).scrollTop() > 100) {
    $("#header").addClass("header-scrolled");
  }

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $(".back-to-top").fadeIn("slow");
    } else {
      $(".back-to-top").fadeOut("slow");
    }
  });

  $(".back-to-top").click(function () {
    $("html, body").animate(
      {
        scrollTop: 0,
      },
      1500,
      "easeInOutExpo"
    );
    return false;
  });

  /***** Expand & Less *****/
  /* ERP */
  $(".erpList").each(function () {
    var $ul = $(this),
      $lis = $ul.find("li:gt(7)"),
      isExpanded = $ul.hasClass("expanded");
    $lis[isExpanded ? "show" : "hide"]();

    if ($lis.length > 0) {
      $(".seemore-option .erpml").click(function (event) {
        var isExpanded = $ul.hasClass("expanded");
        event.preventDefault();
        $(this).html(
          isExpanded
            ? "<i class='bx bx-plus'></i>See more ERP skills"
            : "<i class='bx bx-minus'></i>See Less ERP skills"
        );
        $ul.toggleClass("expanded");
        $lis.toggle();
      });
    }
  });
  /* PLM */
  $(".plmList").each(function () {
    var $ul = $(this),
      $lis = $ul.find("li:gt(7)"),
      isExpanded = $ul.hasClass("expanded");
    $lis[isExpanded ? "show" : "hide"]();

    if ($lis.length > 0) {
      $(".seemore-option .plmml").click(function (event) {
        var isExpanded = $ul.hasClass("expanded");
        event.preventDefault();
        $(this).html(
          isExpanded
            ? "<i class='bx bx-plus'></i>See more PLM skills"
            : "<i class='bx bx-minus'></i>See Less PLM skills"
        );
        $ul.toggleClass("expanded");
        $lis.toggle();
      });
    }
  });
  /* CRM */
  $(".crmList").each(function () {
    var $ul = $(this),
      $lis = $ul.find("li:gt(7)"),
      isExpanded = $ul.hasClass("expanded");
    $lis[isExpanded ? "show" : "hide"]();

    if ($lis.length > 0) {
      $(".seemore-option .crmml").click(function (event) {
        var isExpanded = $ul.hasClass("expanded");
        event.preventDefault();
        $(this).html(
          isExpanded
            ? "<i class='bx bx-plus'></i>See more CRM skills"
            : "<i class='bx bx-minus'></i>See Less CRM skills"
        );
        $ul.toggleClass("expanded");
        $lis.toggle();
      });
    }
  });
  /* QMS */
  $(".qmsList").each(function () {
    var $ul = $(this),
      $lis = $ul.find("li:gt(7)"),
      isExpanded = $ul.hasClass("expanded");
    $lis[isExpanded ? "show" : "hide"]();

    if ($lis.length > 0) {
      $(".seemore-option .qmsml").click(function (event) {
        var isExpanded = $ul.hasClass("expanded");
        event.preventDefault();
        $(this).html(
          isExpanded
            ? "<i class='bx bx-plus'></i>See more QMS skills"
            : "<i class='bx bx-minus'></i>See Less QMS skills"
        );
        $ul.toggleClass("expanded");
        $lis.toggle();
      });
    }
  });
  /* BI/BA */
  $(".bibaList").each(function () {
    var $ul = $(this),
      $lis = $ul.find("li:gt(7)"),
      isExpanded = $ul.hasClass("expanded");
    $lis[isExpanded ? "show" : "hide"]();

    if ($lis.length > 0) {
      $(".seemore-option .bibaml").click(function (event) {
        var isExpanded = $ul.hasClass("expanded");
        event.preventDefault();
        $(this).html(
          isExpanded
            ? "<i class='bx bx-plus'></i>See more BI/BA skills"
            : "<i class='bx bx-minus'></i>See Less BI/BA skills"
        );
        $ul.toggleClass("expanded");
        $lis.toggle();
      });
    }
  });
  /* big data */
  $(".bigdataList").each(function () {
    var $ul = $(this),
      $lis = $ul.find("li:gt(7)"),
      isExpanded = $ul.hasClass("expanded");
    $lis[isExpanded ? "show" : "hide"]();

    if ($lis.length > 0) {
      $(".seemore-option .bigdata").click(function (event) {
        var isExpanded = $ul.hasClass("expanded");
        event.preventDefault();
        $(this).html(
          isExpanded
            ? "<i class='bx bx-plus'></i>See more BDP skills"
            : "<i class='bx bx-minus'></i>See Less BDP skills"
        );
        $ul.toggleClass("expanded");
        $lis.toggle();
      });
    }
  });
  /* SCM */
  $(".scmList").each(function () {
    var $ul = $(this),
      $lis = $ul.find("li:gt(7)"),
      isExpanded = $ul.hasClass("expanded");
    $lis[isExpanded ? "show" : "hide"]();

    if ($lis.length > 0) {
      $(".seemore-option .scmml").click(function (event) {
        var isExpanded = $ul.hasClass("expanded");
        event.preventDefault();
        $(this).html(
          isExpanded
            ? "<i class='bx bx-plus'></i>See more SCM skills"
            : "<i class='bx bx-minus'></i>See Less SCM skills"
        );
        $ul.toggleClass("expanded");
        $lis.toggle();
      });
    }
  });
  /* HRMS */
  $(".hrmsList").each(function () {
    var $ul = $(this),
      $lis = $ul.find("li:gt(7)"),
      isExpanded = $ul.hasClass("expanded");
    $lis[isExpanded ? "show" : "hide"]();

    if ($lis.length > 0) {
      $(".seemore-option .hrmllink").click(function (event) {
        var isExpanded = $ul.hasClass("expanded");
        event.preventDefault();
        $(this).html(
          isExpanded
            ? "<i class='bx bx-plus'></i>See more HRMS skills"
            : "<i class='bx bx-minus'></i>See Less HRMS skills"
        );
        $ul.toggleClass("expanded");
        $lis.toggle();
      });
    }
  });
  /* CMS */
  $(".cmsList").each(function () {
    var $ul = $(this),
      $lis = $ul.find("li:gt(7)"),
      isExpanded = $ul.hasClass("expanded");
    $lis[isExpanded ? "show" : "hide"]();

    if ($lis.length > 0) {
      $(".seemore-option .cmsml").click(function (event) {
        var isExpanded = $ul.hasClass("expanded");
        event.preventDefault();
        $(this).html(
          isExpanded
            ? "<i class='bx bx-plus'></i>See more CMS skills"
            : "<i class='bx bx-minus'></i>See Less CMS skills"
        );
        $ul.toggleClass("expanded");
        $lis.toggle();
      });
    }
  });
    /* LMS */
    $(".lmsList").each(function () {
      var $ul = $(this),
        $lis = $ul.find("li:gt(7)"),
        isExpanded = $ul.hasClass("expanded");
      $lis[isExpanded ? "show" : "hide"]();
  
      if ($lis.length > 0) {
        $(".seemore-option .lmsml").click(function (event) {
          var isExpanded = $ul.hasClass("expanded");
          event.preventDefault();
          $(this).html(
            isExpanded
              ? "<i class='bx bx-plus'></i>See more LMS skills"
              : "<i class='bx bx-minus'></i>See Less LMS skills"
          );
          $ul.toggleClass("expanded");
          $lis.toggle();
        });
      }
    });
        /* MES */
        $(".mesList").each(function () {
          var $ul = $(this),
            $lis = $ul.find("li:gt(7)"),
            isExpanded = $ul.hasClass("expanded");
          $lis[isExpanded ? "show" : "hide"]();
      
          if ($lis.length > 0) {
            $(".seemore-option .mesml").click(function (event) {
              var isExpanded = $ul.hasClass("expanded");
              event.preventDefault();
              $(this).html(
                isExpanded
                  ? "<i class='bx bx-plus'></i>See more MES skills"
                  : "<i class='bx bx-minus'></i>See Less MES skills"
              );
              $ul.toggleClass("expanded");
              $lis.toggle();
            });
          }
        });
  /* ETL */
  $(".etlList").each(function () {
    var $ul = $(this),
      $lis = $ul.find("li:gt(7)"),
      isExpanded = $ul.hasClass("expanded");
    $lis[isExpanded ? "show" : "hide"]();

    if ($lis.length > 0) {
      $(".seemore-option .etlml").click(function (event) {
        var isExpanded = $ul.hasClass("expanded");
        event.preventDefault();
        $(this).html(
          isExpanded
            ? "<i class='bx bx-plus'></i>See more ETL skills"
            : "<i class='bx bx-minus'></i>See Less ETL skills"
        );
        $ul.toggleClass("expanded");
        $lis.toggle();
      });
    }
  });
  /**
   * Animation on scroll
   */
  // Init AOS
  function aos_init() {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }
  $(window).on("load", function () {
    aos_init();
  });

  /*** Input Range ***/
  document.querySelectorAll(".__range-step").forEach(function (ctrl) {
    var el = ctrl.querySelector("input");
    var output = ctrl.querySelector("output");
    var newPoint, newPlace, offset;
    el.oninput = function () {
      // colorize step options
      ctrl.querySelectorAll("option").forEach(function (opt) {
        if (opt.value <= el.valueAsNumber) opt.style.backgroundColor = "green";
        else opt.style.backgroundColor = "#aaa";
      });
      // colorize before and after
      var valPercent =
        (el.valueAsNumber - parseInt(el.min)) /
        (parseInt(el.max) - parseInt(el.min));
      var style =
        "background-image: -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(" +
        valPercent +
        ", green), color-stop(" +
        valPercent +
        ", #aaa));";
      el.style = style;

      // Popup
      // if ((' ' + ctrl.className + ' ').indexOf(' ' + '__range-step-popup' + ' ') > -1) {
      //     var selectedOpt = ctrl.querySelector('option[value="' + el.value + '"]');
      //     output.innerText = selectedOpt.text;
      //     output.style.left = "50%";
      //     output.style.className = "firstchild";
      //     output.style.left = ((selectedOpt.offsetLeft + selectedOpt.offsetWidth / 2) - output.offsetWidth / 2) + 'px';
      // }
    };
    el.oninput();
  });

  window.onresize = function () {
    document.querySelectorAll(".__range").forEach(function (ctrl) {
      var el = ctrl.querySelector("input");
      el.oninput();
    });
  };
})(jQuery);
