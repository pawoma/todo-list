// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

function save(e) {
  var theValue = document.querySelector('.textarea').value
  if (!theValue) {
    console.log('input content is null');
    return;
  }

  getTodoList(function (list) {

    list.push(theValue)

    renderTodoList(list)

    setTodoList(list, function () {
      document.querySelector('.textarea').value = ''
    })
  })
}

function getTodoList(callback) {
  console.log(chrome)
  chrome.storage.sync.get('todoList', function (item) {
    console.log('get successed', item);

    let list = item.todoList || []

    callback && callback(list)
  });
}

function setTodoList(data, callback) {
  chrome.storage.sync.set({ 'todoList': data }, function () {
    console.log('save successed');
    callback && callback()
  });
}

function renderTodoList(list) {
  var listWrap = document.querySelector('.todo-list');
  var html = ''
  list.forEach(function (value, index) {
    html += '<li><input id="' + index + '" type="checkbox" /><label for="' + index + '">' + value + '</label></li>'
  })
  listWrap.innerHTML = html
}

document.addEventListener('DOMContentLoaded', function () {
  var saveBtn = document.querySelector('#save-btn');
  saveBtn.addEventListener('click', save);
  getTodoList(function (list) {
    renderTodoList(list)
  })
});
