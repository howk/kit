const AW = {};

$.validator.addMethod('mobileRu', function(phone_number, element) {
  const ruPhone_number = phone_number.replace( /\(|\)|\s+|-/g, "" );
  return this.optional( element ) || ruPhone_number.length > 9 && /^((\+7|7|8)+([0-9]){10})$/.test(ruPhone_number);
}, "Please specify a valid mobile number." );

AW.FANCYBOX_DEFAULTS = {
  hideScrollbar: false,
  Hash: false,
  Thumbs: {
    type: 'classic',
  },
  Toolbar: {
    display: {
      left: ['infobar'],
      middle: [
        'zoomIn',
        'zoomOut',
      ],
      right: ['close'],
    },
  },
}

AW.initMask = function($field) {
  const type = $field.attr('data-mask');
  switch (type) {
    case 'phone':
      IMask($field[0], {
        mask: '+{7} (000) 000-00-00',
        lazy: false,
        placeholderChar: '_'
      });
    break;
  }
};

AW.validateForm = function($el) {
  if ($el.length === 0) return;

  const validator = $el.validate({
    ignore: [],
    errorClass: 'form-group__error',
    errorPlacement: function (error, element) {
      const $parent = $(element).closest('.form-group').length ? $(element).closest('.form-group') : $(element).closest('.form-group1');
      $parent.append(error);
    },
    highlight: function (element) {
      const $parent = $(element).closest('.form-group').length ? $(element).closest('.form-group') : $(element).closest('.form-group1');
      $parent.addClass('form-group_error');
    },
    unhighlight: function (element) {
      const $parent = $(element).closest('.form-group').length ? $(element).closest('.form-group') : $(element).closest('.form-group1');
      $parent.removeClass('form-group_error');
    },
    submitHandler: function(form, event) {
      event.preventDefault();
      const trigger = $el.attr('data-onsubmit-trigger');
      if (trigger) {
        $(document).trigger(trigger, {event, form});
      } else {
        form.submit();
      }
    }
  });

  $el.find('.field-input1, .checkbox__input, select').each(function () {
    if ($(this).is(':required')) {
      if ($(this).attr('name') === 'agreement') {
        $(this).rules('add', {
            required: true,
            messages: {
                required: 'Вы должны согласиться',
            }
        });
      } else {
        $(this).rules('add', {
          required: true,
          messages: {
            required: 'Заполните это поле',
          }
        });
      }
    }

    if ($(this).attr('data-type') === 'phone') {
      $(this).rules('add', {
        mobileRu: true,
        messages: {
          mobileRu: 'Неверный формат',
        }
      });
    }

    if ($(this).attr('data-type') === 'email') {
      $(this).rules('add', {
        email: true,
        messages: {
          email: 'Неверный формат',
        }
      });
    }
  });

  return validator;
}

$(document).ready(() => {
  Fancybox.defaults.Hash = false;
  Fancybox.defaults.l10n = {
    CLOSE: 'Закрыть',
    NEXT: 'Следующий',
    PREV: 'Предыдущий',
    MODAL: 'Вы можете закрыть это окно нажав на клавишу ESC',
    ERROR: 'Что-то пошло не так, пожалуйста, попробуйте еще раз',
    IMAGE_ERROR: 'Изображение не найдено',
    ELEMENT_NOT_FOUND: 'HTML элемент не найден',
    AJAX_NOT_FOUND: 'Ошибка загрузки AJAX : Не найдено',
    AJAX_FORBIDDEN: 'Ошибка загрузки AJAX : Нет доступа',
    IFRAME_ERROR: 'Ошибка загрузки страницы',
    ZOOMIN: 'Увеличить',
    ZOOMOUT: 'Уменьшить',
    TOGGLE_THUMBS: 'Галерея',
    TOGGLE_SLIDESHOW: 'Слайдшоу',
    TOGGLE_FULLSCREEN: 'На весь экран',
    DOWNLOAD: 'Скачать'
  };

  Fancybox.bind('[data-fancybox]', AW.FANCYBOX_DEFAULTS);

  // Этот хак помогает избежать прыжков анимации при загрузке страницы
  $('body').removeClass('preload');

  $('[data-mask]').each(function () {
    AW.initMask($(this));
  });

  $('[data-select1]').each(function() {
    new TomSelect($(this)[0],{
      controlInput: null,
      create: true,
      render:{
        item: function (data, escape) {
          return `
            <div class="item">
              ${escape(data.text)}
            </div>
          `;
        },
      },
      onInitialize:function() {
        $(this.control).append(`
          <svg aria-hidden="true" width="10" height="6">
            <use xlink:href="img/sprite.svg#chevron2"></use>
          </svg>
        `);
      }
    });
  });

  $('[data-expandable-handle]').click(function () {
    const $parent = $(this).closest('[data-expandable]');
    const $accordion = $(this).closest('[data-container="accordion"]');
    if ($parent.attr('data-expandable') === 'collapsed') {
      $accordion.find('[data-expandable="expanded"] [data-expandable-clip]').css('overflow', 'hidden');
      $accordion.find('[data-expandable="expanded"]').attr('data-expandable', 'collapsed');
      $parent.attr('data-expandable', 'expanded');
      setTimeout(() => {
        // Небольшой костыль для ровной работы экспандера
        $parent.find('[data-expandable-clip]').css('overflow', 'visible');
      }, 250);
    } else {
      $parent.find('[data-expandable-clip]').css('overflow', 'hidden');
      $parent.attr('data-expandable', 'collapsed');
    }
  });

  $('.swiper-catalog-wrapper').each(function() {
    const $navNext = $(this).find('.swiper-nav_next');
    const $navPrev = $(this).find('.swiper-nav_prev');
    new Swiper($(this).find('.swiper-catalog')[0], {
      loop: false,
      spaceBetween: 31,
      slidesPerView: 1,
      watchSlidesProgress: true,
      navigation: {
        nextEl: $navNext[0],
        prevEl: $navPrev[0],
      },
      breakpoints: {
        650: {
          slidesPerView: 2,
        },
        900: {
          slidesPerView: 3,
        },
        1280: {
          slidesPerView: 4,
        }
      }
    });
  });

  $('body').on('click', function(event) {
    if (
      $('.dd-header-catalog').hasClass('dd-header-catalog_active')
      &&
      $(event.target).attr('data-action') !== 'showHeaderCatalog'
      &&
      $(event.target).closest('[data-action="showHeaderCatalog"]').length === 0
      &&
      $(event.target).closest('.dd-header-catalog').length === 0
      &&
      !$(event.target).hasClass('dd-header-catalog')
    ) {
      hideHeaderCatalog();
    }
  });

  $('body').on('click', '[data-action]', function(event) {
    const alias = $(this).attr('data-action');

    switch (alias) {
      case 'testAction': {

        break;
      }
    }
  });

  $('body').on('input', '[data-action-input]', function(event) {
    const alias = $(this).attr('data-action-input');

    switch (alias) {
      case 'testAction': {

        break;
      }
    }
  });
});
