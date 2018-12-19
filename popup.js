// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

$(function () {

  var todoList = []

  function initTodoList() {
    getTodayDate()
    getTodoList4Store('todoList', function (list) {
      todoList = list
      renderTodoList()
    })
  }

  function getTodayDate(){
    var date = new Date()
    var fullDate = date.getFullYear()+'年'+(date.getMonth()+1)+'月'+date.getDate()+'日'
    $('.cur-date').html(fullDate)
  }

  function save(e) {
    var theValue = $('#input').val()
    if (!theValue) {
      console.log('input content is null');
      return;
    }

    var item = {
      value: theValue,
      id: Date.now(),
      status: false
    }

    updateTodoList({
      type: 'add',
      item: item,
      callback: function () {
        $('#input').val('')
      }
    })

  }


  function getTodoList4Store(key, callback) {
    chrome.storage.sync.get(key, function (data) {
      console.log('get successed', data);
      var list = data[key] || []
      callback && callback(list)
    });
  }

  function saveTodoList2Store(data, callback) {
    chrome.storage.sync.set(data, function () {
      console.log('save successed');
      callback && callback()
    });
  }

  function updateTodoList(opt) {
    switch (opt.type) {
      case 'add':
        todoList.push(opt.item)
        break
      case 'del':
        todoList = todoList.filter(item => item.id != opt.id)
        break
      case 'update':
        todoList.forEach(item => {
          if (item.id == opt.id) {
            item.status = opt.status
          }
        })
        break
      default:
        console.error('not type')
    }

    var data = { 'todoList': todoList }
    saveTodoList2Store(data, function () {
      renderTodoList()
      opt.callback && opt.callback()
    })

  }


  function renderTodoList() {
    var html = ''
    var doneList = todoList.filter(item => item.status)

    todoList.forEach(function (item) {
      html += '<li class="' + (item.status ? 'done' : '') + '"><input id="' + item.id + '" ' + (item.status ? 'checked' : '') + ' type="checkbox" /><label for="' + item.id + '">' + item.value + '</label><span data-id="' + item.id + '" class="remove-link">删除</span></li>'
    })
    $('.todo-list').html(html)
    $('#done-count').html(doneList.length)
    $('#total-count').html(todoList.length)
  }

  $('#save-btn').on('click', function () {
    save()
  })

  $('#archive-btn').on('click', function () {
    alert('此功能还未开发')
  })

  $('.todo-list').on('change', 'input[type="checkbox"]', function () {
    var status = $(this).prop('checked')
    var id = $(this).attr('id')
    updateTodoList({
      type: 'update',
      id: id,
      status: status
    })
  })
  $('.todo-list').on('click', '.remove-link', function () {
    var id = $(this).attr('data-id')
    updateTodoList({
      type: 'del',
      id: id
    })
  })

  initTodoList()

})