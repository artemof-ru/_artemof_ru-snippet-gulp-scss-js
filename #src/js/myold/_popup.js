const popupLinks = document.querySelectorAll('.popup-link');
const body = document.querySelector('body');
const lockPadding = document.querySelectorAll('.lock-padding');
let unlock = true; //для исключения двойного нажатия
const timeout = 800; //ms для блокировки скролла
if (popupLinks.length > 0) {
  for (let index = 0; index < popupLinks.length; index++) {
    const popupLink = popupLinks[index];
    popupLink.addEventListener('click', function (e) {
      const popupName = popupLink.getAttribute('href').replace('#', '');
      const curentPopup = document.getElementById(popupName);
      popupOpen(curentPopup);
      e.preventDefault();
    });
  }
}
const popupCloseIcon = document.querySelectorAll(
  '.close-popup'); //в html добавить класс .close-popup, при нажатии которого popup закрывается
if (popupCloseIcon.length > 0) {
  for (let index = 0; index < popupCloseIcon.length; index++) {
    const el = popupCloseIcon[index];
    el.addEventListener('click', function (e) {
      popupClose(el.closest('.popup')); //.closest - возвращает ближайший родительский элемент
      e.preventDefault();
    });
  }
}
function popupOpen(curentPopup) {
  if (curentPopup && unlock) {
    const popupActive = document.querySelector('.popup.open');
    if (popupActive) {
      popupClose(popupActive, false);
    } else {
      bodyLock();
    }
    curentPopup.classList.add('open');
    curentPopup.addEventListener('click', function (e) {
      //если у нажатого объекта нет родителя с классом popup__content, тогда мы popup закрываем 
      if (!e.target.closest('.popup__content')) { //отсекаем все, кроме темной области
        popupClose(e.target.closest('.popup'));
      }
    });
  }
}
function popupClose(popupActive, doUnlock = true) {
  if (unlock) {
    popupActive.classList.remove('open');
    if (doUnlock) {
      bodyUnLock();
    }
  }
}
function bodyLock() {
  //при открыти и закрытии popup пропадает и появляется скролл и контект пляшет, чтобы этого не было:
  const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

  //Для того чтобы фиксированная шапка с классом .lock-padding не пригала при открытии и закрытии popup
  if (lockPadding.length > 0) {
    for (let index = 0; index < lockPadding.length; index++) {
      const el = lockPadding[index];
      el.style.paddingRight = lockPaddingValue;
    }
  }
  body.style.paddingRight = lockPaddingValue;
  body.classList.add('lock');
  //чтобы не было повторных нажатий
  unlock = false;
  setTimeout(function () {
    unlock = true;
  }, timeout);
}
function bodyUnLock() {
  setTimeout(function () {
    if (lockPadding.length > 0) {
      for (let index = 0; index < lockPadding.length; index++) {
        const el = lockPadding[index];
        el.style.paddingRight = '0px';
      }
    }
    body.style.paddingRight = '0px';
    body.classList.remove('lock');
  }, timeout);
  unlock = false;
  setTimeout(function () {
    unlock = true;
  }, timeout);
}
document.addEventListener('keydown', function (e) {
  if (e.which === 27) {
    const popupActive = document.querySelector('.popup.open');
    popupClose(popupActive);
  }
});
//Полифилы//Для поддержки кода в старых браузерах
function isInternetExplorer() {
  return window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;
}
if (isInternetExplorer() === false) {
  // alert('Браузер не IE');
  (function () {
    if (!Element.prototype.closest) {
      Element.prototype.closest = function (css) {
        var node = this;
        while (node) {
          if (node.matches(css)) return node;
          else node = node.parentElement;
        }
        return null;
      };
    }
  })();
} else {
  // alert('Сочувствую, но ваш браузер IE');
  (function () {
    if (!Element.prototype.closest) {
      Element.prototype.closest = function (css) {
        var node = this;
        while (node) {
          if (node.msMatchesSelector(css)) return node;
          else node = node.parentElement;
        }
        return null;
      };
    }
  })();
}
(function () {
  //Проверяем поддерждку
  if (!Element.prototype.matches) {
    //определяем свойство
    Element.prototype.matches = Element.prototype.matchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector;
  }
});