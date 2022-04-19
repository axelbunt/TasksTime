const translated_day_names = {'Sun': 'Вс',
                              'Mon': 'Пн',
                              'Tue': 'Вт',
                              'Wed': 'Ср',
                              'Thu': 'Чт',
                              'Fri': 'Пт',
                              'Sat': 'Сб'};

var lastDayClicked = undefined;
var lastDayClickedColor = undefined;


!function () {

  var today = moment();

  function Calendar(selector, events) {
    this.el = document.querySelector(selector);
    this.events = events;
    this.current = moment().date(1);
    this.draw();
    var current = document.querySelector('.today');
    if (current) {
      var self = this;
      window.setTimeout(function () {
        self.openDay(current);
      }, 500);
    }
  }

  Calendar.prototype.draw = function () {
    //Create Header
    this.drawHeader();

    //Draw Month
    this.drawMonth();

//    this.drawLegend();
  };

  Calendar.prototype.drawHeader = function () {
    var self = this;
    if (!this.header) {
      //Create the header elements
      this.header = createElement('div', 'header');
      this.header.className = 'header';

      this.title = createElement('h1');

      var right = createElement('div', 'right');
      right.addEventListener('click', function () {self.nextMonth();});

      var left = createElement('div', 'left');
      left.addEventListener('click', function () {self.prevMonth();});

      //Append the Elements
      this.header.appendChild(this.title);
      this.header.appendChild(right);
      this.header.appendChild(left);
      this.el.appendChild(this.header);
    }

    this.title.innerHTML = this.current.format('MMMM YYYY');
  };

  Calendar.prototype.drawMonth = function () {
    var self = this;

    this.events.forEach(function (ev) {
//      ev.date = self.current.clone().date(Math.random() * (29 - 1) + 1);
      ev.date = moment(ev.date);
    });


    if (this.month) {
      this.oldMonth = this.month;
      this.oldMonth.className = 'month out ' + (self.next ? 'next' : 'prev');
      this.oldMonth.addEventListener('webkitAnimationEnd', function () {
        self.oldMonth.parentNode.removeChild(self.oldMonth);
        self.month = createElement('div', 'month');
        self.backFill();
        self.currentMonth();
        self.fowardFill();
        self.el.appendChild(self.month);
        window.setTimeout(function () {
          self.month.className = 'month in ' + (self.next ? 'next' : 'prev');
        }, 16);
      });
    } else {
      this.month = createElement('div', 'month');
      this.el.appendChild(this.month);
      this.backFill();
      this.currentMonth();
      this.fowardFill();
      this.month.className = 'month new';
    }
  };

//  Calendar.prototype.backFill = function () {
//    var clone = this.current.clone();
//
//    var dayOfWeek = clone.day();
//
//    if(!dayOfWeek) { return; }
//
//    clone.subtract('days', dayOfWeek);
//
//    for(var i = dayOfWeek; i > 1 ; i--) {
//        this.drawDay(clone.add('days', 1));
//    }
//  };
//
//  Calendar.prototype.fowardFill = function() {
//    var clone = this.current.clone().add('months', 1).subtract('days', 1);
//    var dayOfWeek = clone.day();
//
//    if(dayOfWeek === 7) { return; }
//
//    for(var i = dayOfWeek; i < 7 ; i++) {
//        this.drawDay(clone.add('days', 1));
//    }
//}
//
//  Calendar.prototype.currentMonth = function() {
//    var clone = this.current.clone();
//   // console.log(this.current.month());
//
//    while(clone.month() === this.current.month()) {
//        this.drawDay(clone);
//        clone.add('days', 1);
//    }
//}
//
//  Calendar.prototype.getWeek = function(day) {
//    if(!this.week || day.day() === 1) {
//        this.week = createElement('div', 'week');
//        this.month.appendChild(this.week);
//
//    }
//}
  Calendar.prototype.backFill = function () {
    var clone = this.current.clone();

    var dayOfWeek = clone.day();

    if (!dayOfWeek) {return;}

    clone.subtract('days', dayOfWeek + 1);

    for (var i = dayOfWeek; i > 0; i--) {if (window.CP.shouldStopExecution(0)) break;
      this.drawDay(clone.add('days', 1));
    }window.CP.exitedLoop(0);
  };

  Calendar.prototype.fowardFill = function () {
    var clone = this.current.clone().add('months', 1).subtract('days', 1);
    var dayOfWeek = clone.day();
    if (dayOfWeek === 6) {return;}

    for (var i = dayOfWeek; i < 6; i++) {if (window.CP.shouldStopExecution(1)) break;
      this.drawDay(clone.add('days', 1));
    }window.CP.exitedLoop(1);
  };

  Calendar.prototype.currentMonth = function () {
    var clone = this.current.clone();

    while (clone.month() === this.current.month()) {if (window.CP.shouldStopExecution(2)) break;
      this.drawDay(clone);
      clone.add('days', 1);
    }window.CP.exitedLoop(2);
  };

  Calendar.prototype.getWeek = function (day) {
    if (!this.week || day.day() === 0) {
      this.week = createElement('div', 'week');
      this.month.appendChild(this.week);
    }
  };

  Calendar.prototype.drawDay = function (day) {
    var self = this;
    this.getWeek(day);

    //Outer Day
    var outer = createElement('div', this.getDayClass(day));
    outer.addEventListener('click', function () {
      self.openDay(this);
    });

    //Day Name
    var name = createElement('div', 'day-name', day.format('ddd'));
    name.innerHTML = translated_day_names[name.innerHTML];

    //Day Number
    var number = createElement('div', 'day-number', day.format('D'));


    //Events
    var events = createElement('div', 'day-events');
    this.drawEvents(day, events);

    outer.appendChild(name);
    outer.appendChild(number);
    outer.appendChild(events);
    this.week.appendChild(outer);
  };

  Calendar.prototype.drawEvents = function (day, element) {
    if (day.month() === this.current.month()) {
      var todaysEvents = this.events.reduce(function (memo, ev) {
        if (ev.date.isSame(day, 'day')) {
          memo.push(ev);
        }
        return memo;
      }, []);

      todaysEvents.forEach(function (ev) {
        var evSpan = createElement('span', ev.color);
        element.appendChild(evSpan);
      });
    }
  };

  Calendar.prototype.getDayClass = function (day) {
    classes = ['day'];
    if (day.month() - this.current.month() == -1) {
      classes.push('month_before');
    } else if (day.month() - this.current.month() == 1) {
      classes.push('month_after');
    } else if (today.isSame(day, 'day')) {
      classes.push('today');
    }
    return classes.join(' ');
  };

  Calendar.prototype.openDay = function (el) {
    var details, arrow;
    var dayNumber = +el.querySelectorAll('.day-number')[0].innerText;
//    || +el.querySelectorAll('.day-number')[0].textContent;

    if (el.classList.value.indexOf('month_before') > -1) {
      var day = this.current.clone().subtract('month', 1).date(dayNumber);
    } else if (el.classList.value.indexOf('month_after') > -1) {
      var day = this.current.clone().add('month', 1).date(dayNumber);
    } else {
      var day = this.current.clone().date(dayNumber);
    }

    var currentOpened = document.querySelector('.details');

//    if (el == lastDayOpened) {
//      currentOpened.parentNode.removeChild(currentOpened);
//      console.log(1);
//    }
    //Check to see if there is an open details box on the current row
    if (currentOpened && currentOpened.parentNode === el.parentNode) {
      details = currentOpened;
      arrow = document.querySelector('.arrow');
    } else {
      //Close the open events on different week row
      //currentOpened && currentOpened.parentNode.removeChild(currentOpened);
      if (currentOpened) {
        currentOpened.addEventListener('webkitAnimationEnd', function () {
          currentOpened.parentNode.removeChild(currentOpened);
        });
        currentOpened.addEventListener('oanimationend', function () {
          currentOpened.parentNode.removeChild(currentOpened);
        });
        currentOpened.addEventListener('msAnimationEnd', function () {
          currentOpened.parentNode.removeChild(currentOpened);
        });
        currentOpened.addEventListener('animationend', function () {
          currentOpened.parentNode.removeChild(currentOpened);
        });
        currentOpened.className = 'details out';
      }

      //Create the Details Container
      details = createElement('div', 'details in');

      //Create the arrow
      var arrow = createElement('div', 'arrow');

      //Create the event wrapper
      details.appendChild(arrow);
//      el.parentNode.appendChild(details);

      if (lastDayClicked == undefined) {
        lastDayClickedColor = el.style.color;
      } else {
        lastDayClicked.style.color = lastDayClickedColor;
        el.style.color = 'red';
      }
      lastDayClicked = el;
    }

    var todaysEvents = this.events.reduce(function (memo, ev) {
      if (ev.date.isSame(day, 'day')) {
      //day.month() === this.current.month()
        memo.push(ev);
      }
      return memo;
    }, []);

    this.renderEvents(todaysEvents, details, el);

    arrow.style.left = el.offsetLeft - el.parentNode.offsetLeft + 27 + 'px';
  };

  Calendar.prototype.renderEvents = function (events, ele, el) {
    //Remove any events in the current details element
    var for_tasks = document.querySelector('.tasks');
//    console.log(events);
    for_tasks.innerHTML = '';
    var currentWrapper = ele.querySelector('.events');
    var wrapper = createElement('div', 'events in' + (currentWrapper ? ' new' : ''));

    events.forEach(function (ev) {
      var div = createElement('div', 'event');
      var square = createElement('div', 'event-category ' + ev.color);
      var span = createElement('span', '', ev.eventName);

      div.appendChild(square);
      div.appendChild(span);
      wrapper.appendChild(div);
      for_tasks.appendChild(wrapper);
    });

    if (!events.length) {
      var div = createElement('div', 'event empty');
      var span = createElement('span', '', 'No Events');

      div.appendChild(span);
      wrapper.appendChild(div);
      for_tasks.appendChild(wrapper);
    }

    if (currentWrapper) {
      currentWrapper.className = 'events out';
      currentWrapper.addEventListener('webkitAnimationEnd', function () {
        currentWrapper.parentNode.removeChild(currentWrapper);
        ele.appendChild(wrapper);
        for_tasks.appendChild(wrapper);
      });
      currentWrapper.addEventListener('oanimationend', function () {
        currentWrapper.parentNode.removeChild(currentWrapper);
        ele.appendChild(wrapper);
        for_tasks.appendChild(wrapper);
      });
      currentWrapper.addEventListener('msAnimationEnd', function () {
        currentWrapper.parentNode.removeChild(currentWrapper);
        ele.appendChild(wrapper);
        for_tasks.appendChild(wrapper);
      });
      currentWrapper.addEventListener('animationend', function () {
        currentWrapper.parentNode.removeChild(currentWrapper);
        ele.appendChild(wrapper);
        for_tasks.appendChild(wrapper);
      });
    } else {
      ele.appendChild(wrapper);
      for_tasks.appendChild(wrapper);
    }
  };

  Calendar.prototype.drawLegend = function () {
    var legend = createElement('div', 'legend');
    var calendars = this.events.map(function (e) {
      return e.calendar + '|' + e.color;
    }).reduce(function (memo, e) {
      if (memo.indexOf(e) === -1) {
        memo.push(e);
      }
      return memo;
    }, []).forEach(function (e) {
      var parts = e.split('|');
      var entry = createElement('span', 'entry ' + parts[1], parts[0]);
      legend.appendChild(entry);
    });
    this.el.appendChild(legend);
  };

  Calendar.prototype.nextMonth = function () {
    this.current.add('months', 1);
    this.next = true;
    this.draw();
  };

  Calendar.prototype.prevMonth = function () {
    this.current.subtract('months', 1);
    this.next = false;
    this.draw();
  };

  window.Calendar = Calendar;

  function createElement(tagName, className, innerText) {
    var ele = document.createElement(tagName);
    if (className) {
      ele.className = className;
    }
    if (innerText) {
      ele.innderText = ele.textContent = innerText;
    }
    return ele;
  }
}();

!function () {
//  var data = [
//  { eventName: 'Lunch Meeting w/ Mark', calendar: 'Work', color: 'orange' },
//  { eventName: 'Interview - Jr. Web Developer', calendar: 'Work', color: 'orange' },
//  { eventName: 'Demo New App to the Board', calendar: 'Work', color: 'orange' },
//  { eventName: 'Dinner w/ Marketing', calendar: 'Work', color: 'orange' },
//
//  { eventName: 'Game vs Portalnd', calendar: 'Sports', color: 'blue' },
//  { eventName: 'Game vs Houston', calendar: 'Sports', color: 'blue' },
//  { eventName: 'Game vs Denver', calendar: 'Sports', color: 'blue' },
//  { eventName: 'Game vs San Degio', calendar: 'Sports', color: 'blue' },
//
//  { eventName: 'School Play', calendar: 'Kids', color: 'yellow' },
//  { eventName: 'Parent/Teacher Conference', calendar: 'Kids', color: 'yellow' },
//  { eventName: 'Pick up from Soccer Practice', calendar: 'Kids', color: 'yellow' },
//  { eventName: 'Ice Cream Night', calendar: 'Kids', color: 'yellow' },
//
//  { eventName: 'Free Tamale Night', calendar: 'Other', color: 'green' },
//  { eventName: 'Bowling Team', calendar: 'Other', color: 'green' },
//  { eventName: 'Teach Kids to Code', calendar: 'Other', color: 'green' },
//  { eventName: 'Startup Weekend', calendar: 'Other', color: 'green' }];
   var data = [
    { eventName: 'Защита проекта, паник', calendar: 'Work', color: 'orange' ,date:'2022-04-19'},
    { eventName: 'Lunch Meeting w/ Mark', calendar: 'Work', color: 'orange' ,date:'2022-04-27'},
    { eventName: 'Interview - Jr. Web Developer', calendar: 'Work', color: 'orange',date:'2022-04-28' },
    { eventName: 'Demo New App to the Board', calendar: 'Work', color: 'orange',date:'2022-04-29' },
    { eventName: 'Smth', calendar: 'Work', color: 'orange',date:'2022-04-30' },
    { eventName: 'Smth', calendar: 'Work', color: 'orange',date:'2022-04-30' },
    { eventName: 'Smth', calendar: 'Work', color: 'orange',date:'2022-04-30' },
    { eventName: 'Smth', calendar: 'Work', color: 'orange',date:'2022-04-30' }
    ];

  function addDate(ev) {}

  var calendar = new Calendar('#calendar', data);

}();
