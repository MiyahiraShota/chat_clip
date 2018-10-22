$(function() {
  var room_id = $(location)
    .attr("hash")
    .replace("#!rid", "");

  loadData = function() {
    $("#chatClipMarea").empty();
    var room_id = $(location)
      .attr("hash")
      .replace("#!rid", "");
    var localStorageData = JSON.parse(localStorage.getItem(room_id));

    if (localStorageData) {
      console.log(localStorageData);
      for (var dataId in localStorageData) {
        var data = localStorageData[dataId];
        $("#chatClipMarea").append(
          '<div id="cc-' +
            data.mid +
            '" class="cc-message">' +
            '<div class="cc-m-head"><div class="cc-name">' +
            data.name +
            '</div><div class="cc-timestamp">' +
            data.timestamp +
            "</div></div>" +
            '<pre class="cc-body">' +
            data.body +
            "</pre>" +
            '<div class="cc-m-footer">' +
            '<div class="_replyMoveButton _roomLink replyMessageTooltip__moveButton" data-rid="' +
            data.rid +
            '" data-mid="' +
            data.mid +
            '"><span class="icoFontActionMove "></span></div>' +
            '<div class="cc-m-delete-btn button" data-rid="' +
            data.rid +
            '" data-mid="' +
            data.mid +
            '"><span class="icoFontActionDelete"></span></div>' +
            "</div>" +
            "</div>"
        );
      }
    }

    var ccsc = JSON.parse(localStorage.getItem("cc_short_cut"));
    console.log(ccsc);
    if (ccsc) {
      $("#_chatSendTool .ccsc_btn").remove();
      for (var ccscId in ccsc) {
        var sc = ccsc[ccscId];
        $("#_chatSendTool").append(
          '<li id="_emoticon" class="_showDescription ccsc_btn" role="button" aria-label="ショートカット：' +
            sc.title +
            '" data-ccscId="' +
            ccscId +
            '" style="width: auto; padding: 0;">' +
            '<span class="button _cwBN">' +
            sc.title +
            "</span>" +
            "</li>"
        );
      }
    }

    // ccsc_btn
    $(".ccsc_btn").off("click");
    $(".ccsc_btn").on("click", function(e) {
      var ccsc = JSON.parse(localStorage.getItem("cc_short_cut"));
      var ccscid = $(this).attr("data-ccscid");
      var sc = ccsc[ccscid];

      $("#_chatText").selection("insert", {
        text: sc.body,
        mode: "before",
        caret: "keep"
      });

      if (sc.afterBody) {
        $("#_chatText").selection("insert", {
          text: sc.afterBody,
          mode: "after",
          caret: "keep"
        });
      }

      if (sc.send) {
        $("#_sendButton").click();
      }
    });

    $(".cc-m-delete-btn").off("click");
    $(".cc-m-delete-btn").on("click", function(e) {
      var rid = $(this).attr("data-rid");
      var mid = $(this).attr("data-mid");
      console.log(mid);

      var localStorageData = JSON.parse(localStorage.getItem(rid));
      delete localStorageData[mid];

      localStorage.setItem(rid, JSON.stringify(localStorageData));
      $("#cc-" + mid).slideUp();
    });
  };

  roomchange = function() {
    var room_id = $(location)
      .attr("hash")
      .replace("#!rid", "");
    console.log(room_id);
    // クリップボタン追加
    $("._message.timelineMessage").map(function() {
      var mid = $(this).attr("data-mid");
      $(this)
        .find("._timeStamp")
        .append(
          '<span class="chat_clip icoFontSendFile chatInput__fileIcon " style="margin-left: 10px;" data-mid="' +
            mid +
            '"></span>'
        );
    });

    // クリップ一覧を追加
    if (!$("#_subContent #checkClipWrap").length) {
      $("#_subContent").append(
        '<div id="checkClipWrap">' +
          '<div id="checkClipWrapWnav"><svg id="_areaScaleIconRight" class="chatSendArea__areaScaleIconRight" viewBox="0 0 10 10" width="16" height="16"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon_areaScaleButtonRight" fill-rule="evenodd"></use></svg></div>' +
          '<div id="chatClipMarea"></div>' +
          "</div>"
      );

      $("#checkClipWrapWnav").on("click", function() {
        $("#checkClipWrap").toggleClass("on");
      });
    }

    // ショートカット追加ボタンを設置
    if (!$("#ccAddShortCut").length) {
      $("#_chatSendArea").prepend(
        '<div id="ccAddShortCutWrap" style="display:none;">' +
          '<div id="ccAddShortCutInner"><div id="ccAddShortCut__tools">' +
          '<span class="left_wrap"><input type="text" id="ccAddShortCutTitle" placeholder="タイトル（5文字）" maxlength="5">' +
          '<button id="ccAddShortCutCursorTabAdd" class="button" style="margin-left: 5px;">カーソル位置</button>' +
          '<span id="_sendEnterActionArea" style="margin-left: 5px;" class="chatInput__settingEnterAction" role="button" aria-labe="">' +
          '<span role="checkbox" aria-checked="false" id="ccscSendCheck" type="checkbox" class="_cwCB _cwCBUnchecked ico15Checkbox chatInput__settingEnterActionCheckbox"><input type="hidden" value="on"></span>' +
          '<span class="chatInput__settingEnterActionIcon">即送信</span>' +
          "</span>" +
          "</span>" +
          '<span class="right_wrap"><button id="ccAddShortCutBtn" class="button">追加</button><button id="ccAddShortCutDoneBtn" class="button" style="margin-left: 5px;">閉じる</button></span>' +
          '</div><textarea id="ccAddShortCutInput" placeholder="固定文を入力してください"></textarea></div>' +
          "</div>"
      );
      $("#_chatSendToolbar .chatInput__submitContainer").prepend(
        '<div id="ccAddShortCut" class="_cwBN button" role="button" tabindex="1" aria-disabled="false">clip ショートカット</div>'
      );
    }

    $("#ccAddShortCutInput").height($("#_chatText").height());

    // clip ショートカットボタン
    $(
      "#ccAddShortCut, #ccAddShortCutDoneBtn, #ccAddShortCutBtn, #ccAddShortCutCursorTabAdd"
    ).off("click");
    $("#ccAddShortCut").on("click", function(e) {
      $("#ccAddShortCutWrap").slideToggle();
      $(".chatSendArea__chatInput").slideToggle();
      $("#ccAddShortCutInput").height($("#_chatText").height());
    });

    // clip ショートカットボタン
    $("#ccAddShortCutCursorTabAdd").on("click", function(e) {
      $("#ccAddShortCutInput").selection("insert", {
        text: "[ccCursor]",
        mode: "before",
        caret: "keep"
      });
    });

    // 追加ボタン
    $("#ccAddShortCutBtn").on("click", function(e) {
      $("#ccAddShortCutWrap").slideToggle();
      $(".chatSendArea__chatInput").slideToggle();

      var tile = $("#ccAddShortCutTitle").val();
      var bodyText = $("#ccAddShortCutInput").val();
      var sendCheck = $("#ccscSendCheck").attr("aria-checked");
      console.log(send);
      var send = false;
      if (sendCheck === "true") {
        send = true;
      }

      var bodyText = bodyText.split("[ccCursor]");
      var body = bodyText[0];
      var afterBody = bodyText[1];

      var ccsc = localStorage.getItem("cc_short_cut");

      console.log(ccsc);
      if (ccsc) {
        var ccsc = JSON.parse(ccsc);
        ccsc.push({
          title: tile,
          body: body,
          afterBody: afterBody,
          send: send
        });
        localStorage.setItem("cc_short_cut", JSON.stringify(ccsc));
      } else {
        var ccsc = [];
        ccsc.push({
          title: tile,
          body: body,
          afterBody: afterBody,
          send: send
        });
        localStorage.setItem("cc_short_cut", JSON.stringify(ccsc));
      }

      $("#ccAddShortCutTitle").val("");
      $("#ccAddShortCutInput").val("");
      $("#ccscSendCheck").val("");

      loadData();
    });

    // 閉じるボタン
    $("#ccAddShortCutDoneBtn").on("click", function(e) {
      $("#ccAddShortCutWrap").slideToggle();
      $(".chatSendArea__chatInput").slideToggle();
    });

    // クリップイベント
    $(".chat_clip").off("click");
    $(".chat_clip").on("click", function(e) {
      var room_id = $(location)
        .attr("hash")
        .replace("#!rid", "");
      var localStorageData = localStorage.getItem(room_id);

      console.log("chat_clip");
      var mid = $(this).attr("data-mid");

      var name = $(
        "#_messageId" + mid + " .timelineMessage__userName span"
      ).text();
      var timestamp = $("#_messageId" + mid + " ._timeStamp").text();
      var body = $("#_messageId" + mid + " .timelineMessage__message").html();

      var mdata = {
        rid: room_id,
        mid: mid,
        name: name,
        timestamp: timestamp,
        body: body
      };

      console.log(localStorageData);
      if (localStorageData) {
        var localStorageData = JSON.parse(localStorageData);
        localStorageData[mid] = mdata;
        localStorage.setItem(room_id, JSON.stringify(localStorageData));
      } else {
        var localStorageData = {};
        localStorageData[mid] = mdata;
        localStorage.setItem(room_id, JSON.stringify(localStorageData));
      }
      loadData();
    });

    loadData();
  };

  // タイムラインHTMLの変更を監視
  checkDomChange = function() {
    var observeTgt = document.getElementById("_timeLine");
    var observer = new MutationObserver(function(mrecords, mobserver) {
      var checkChange = function(x) {
        if (
          x.addedNodes &&
          x.addedNodes instanceof NodeList &&
          x.addedNodes.length > 0 &&
          x.type === "childList"
        ) {
          return true;
        }
        return false;
      };
      if (mrecords.some(checkChange)) {
        // setEvent();
        roomchange();
      }
    });

    // 子要素のみを対象、孫要素以下は検知しない
    observer.observe(observeTgt, { childList: true, subtree: false });
  };

  checkDomChange();
});
