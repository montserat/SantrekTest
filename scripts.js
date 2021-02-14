var areas = [];

$(document).ready(function () {
  areas = $("div[id*=Area]").get();

  generateInputFields();
  generateAddRemoveButtons();
  generateAllResultsBlock();
  generateSelectMarkers();
});

function generateInputFields() {
  for (let i = 1; i < 6; i++) {
    $("#inputForm").append(
      generateFormField(`input${i}`, `button${i}`, "Применить")
    );
  }

  $("#button1").attr("id", "createCheckboxes").text("Создать блок чекбоксов");
  $("#button2").attr("id", "createRadio").text("Создать блок радиокнопок");
  $("#button3").attr("id", "createImages").text("Создать блок картинок");
  $("#button4").attr("id", "checkMarkers").text("Проверить все маркеры");
  $("#button5").attr("id", "getResults").text("Получить результаты");
}

function generateSelectMarkers() {
  let newDiv = $("<div />", {
    id: "selectDiv",
  });
  let newSelect = $("<select />", {
    name: "markerSelect",
    id: "markerSelect",
    class: "form-control mt-2",
  });
  for (let i of areas) {
    newSelect.append(
      $("<option />", {
        value: i.id,
        text: i.id,
      })
    );
  }
  newDiv.append(newSelect);
  $("#inputForm").prepend(newDiv);
}

function generateAllResultsBlock() {
  $("#mainArea").append(
    $("<div />", {
      class: "border border-warning col my-4 mx-2",
      id: "allResults",
    })
  );
}

function generateAddRemoveButtons() {
  let newDiv = $("<div />", {
    class: "row",
  });

  newDiv.append(
    $("<button/>", {
      text: "Добавить поле",
      id: "addField",
      class: "btn btn-outline-success m-auto",
    })
  );

  newDiv.append(
    $("<button/>", {
      text: "Убрать поле",
      id: "removeField",
      class: "btn btn-outline-danger m-auto",
    })
  );

  $("#mainArea").append(newDiv);
}

function generateFormField(inputName, btnId, btnText) {
  let fieldInfo = {
    wrapperDivClass: "input-group p-3",
    inputClass: "form-control",
    buttonDivClass: "input-group-append",
    buttonClass: "btn btn-outline-primary",
  };

  let newWrapperDiv = $("<div />", {
    class: fieldInfo["wrapperDivClass"],
  });

  let newInput = $("<input/>").attr({
    type: "text",
    class: fieldInfo["inputClass"],
    name: inputName,
    id: inputName,
  });

  let buttonDiv = $("<div />", {
    class: fieldInfo["buttonDivClass"],
  });

  let newButton = $("<button />", {
    class: fieldInfo["buttonClass"],
    id: btnId,
    text: btnText,
  });

  buttonDiv.append(newButton);
  newWrapperDiv.append(newInput).append(buttonDiv);
  return newWrapperDiv;
}

function renderResultArea(nodeId, nodeParent, resultText) {
  if ($(`#${nodeId}`).length) {
    $(`#${nodeId}`).text(resultText);
  } else {
    let textArea = $(
      `<textarea id=${nodeId} style="margin:auto;height:5rem" />`
    ).text(resultText);
    $(`#${nodeParent}`).parent().append(textArea);
  }
}

function renderToMarker(element) {
  let selectedMarkerId = $("#markerSelect option:selected").get()[0].value;
  $(`#${selectedMarkerId}`).append(element);
}

$(document).ready(function () {
  $("#getResults").click(function (e) {
    e.preventDefault();
    let data = $("#inputForm input,select");
    addResult(data);
    let resultText = data
      .serializeArray()
      .map((elem) => `${elem.name}:${elem.value} \n`)
      .join("");

    if ($("#mainFormOutput").length) {
      $("#mainFormOutput").text(resultText);
    } else {
      let textArea = $(
        `<textarea id="mainFormOutput" rows=7 cols=30 style="margin:3% auto;" />`
      ).text(resultText);
      $(textArea).insertBefore("#allResults");
    }
  });
});

$(document).ready(function () {
  $("#addField").click(function (e) {
    e.preventDefault();
    let fields = $("#inputForm input").length;
    $("#inputForm").append(
      generateFormField(
        `input${fields + 1}`,
        `button${fields + 1}`,
        "Применить"
      )
    );
  });
});

$(document).ready(function () {
  $("#removeField").click(function (e) {
    e.preventDefault();
    $("#inputForm div").last().parent().remove();
  });
});

function generateListElement(inputName, inputId, inputValue, inputType) {
  let newListElem = $("<li />", {
    class: "list-group-item",
  });

  let elemWrapper = $("<div />", {
    class: "custom-control custom-" + inputType,
  });

  let newInput = $("<input/>").attr({
    type: inputType,
    class: "custom-control-input",
    name: inputName,
    id: inputId,
    value: inputValue,
  });

  let inputLabel = $("<label />", {
    class: "custom-control-label",
    for: inputId,
  }).text(inputValue);

  elemWrapper.append(newInput).append(inputLabel);
  newListElem.append(elemWrapper);
  return newListElem;
}

$(document).ready(function () {
  $("#createCheckboxes").click(function (e) {
    e.preventDefault();
    if ($("#checkboxList").length) {
      $("#checkboxList").parent().remove();
    }
    if ($("#checkboxResult").length) {
      $("#checkboxResult").remove();
    }

    let data = $("#inputForm input")
      .serializeArray()
      .filter((elem) => elem.value !== "");

    let newWrapper = $("<div />", {
      class: "col-auto m-auto",
    });
    let newList = $("<ul />", {
      class: "list-group py-3 m-auto text-break",
      id: "checkboxList",
    });

    for (let i in data) {
      newList.append(
        generateListElement(
          data[i].value,
          "checkbox" + i,
          data[i].value,
          "checkbox"
        )
      );
    }

    let checkboxButton = $("<button />", {
      class: "btn btn-outline-dark mt-2",
      id: "checkboxButton",
      click: handleCheckboxButton,
    }).text("Применить");

    let buttonListElem = $("<li />", {
      class: "list-unstyled",
    }).append(checkboxButton);

    newList.append(buttonListElem);
    newWrapper.append(newList);
    renderToMarker(newWrapper);
  });
});

$(document).ready(function () {
  $("#checkboxButton").click(handleCheckboxButton);
});

function handleCheckboxButton() {
  let data = $("#checkboxList input:checked");
  addResult(data);
  let resultText = data
    .map(function () {
      return this.value;
    })
    .get();
  renderResultArea("checkboxResult", "checkboxList", resultText);
}

$(document).ready(function () {
  $("#createRadio").click(function (e) {
    if ($("#radioList").length) {
      $("#radioList").parent().remove();
    }
    if ($("#radioResult").length) {
      $("#radioResult").remove();
    }
    e.preventDefault();
    let data = $("#inputForm input")
      .serializeArray()
      .filter((elem) => elem.value !== "");

    let newWrapper = $("<div />", {
      class: "col-auto m-auto",
    });
    let newList = $("<ul />", {
      class: "list-group py-3 text-break",
      id: "radioList",
    });

    for (let i in data) {
      newList.append(
        generateListElement("radiobtn", "radio" + i, data[i].value, "radio")
      );
    }

    let radioButton = $("<button />", {
      class: "btn btn-outline-dark mt-2",
      id: "radioButton",
      click: handleRadioButton,
    }).text("Применить");

    let buttonListElem = $("<li />", {
      class: "list-unstyled",
    }).append(radioButton);

    newList.append(buttonListElem);
    newWrapper.append(newList);
    renderToMarker(newWrapper);
  });
});

$(document).ready(function () {
  $("#radioButton").click(handleRadioButton);
});

function handleRadioButton() {
  let data = $("#radioList input:checked");
  addResult(data);
  let resultText = data
    .map(function () {
      return this.value;
    })
    .get();
  renderResultArea("radioResult", "radioList", resultText);
}

$(document).ready(function () {
  $("#createImages").click(function (e) {
    e.preventDefault();
    if ($("#imageList").length) {
      $("#imageList").parent().remove();
    }
    if ($("#imageResult").length) {
      $("#imageResult").remove();
    }
    let data = $("#inputForm input")
      .serializeArray()
      .filter((elem) => elem.value !== "");

    let newWrapper = $("<div />", {
      class: "col-auto m-auto",
    });
    let newList = $("<div />", {
      class: "col text-center",
      id: "imageList",
    });

    for (let i of data) {
      let imgDiv = $("<div />", {
        class: "row justify-content-center p-1",
      });
      let img = $("<img />", {
        class: "img-fluid",
        src: i.value,
        width: 50,
        height: 50,
        click: function () {
          $(this).toggleClass("selected-image");
        },
      }).appendTo(imgDiv);
      newList.append(imgDiv);
    }

    newList.append(
      $("<button />", {
        class: "btn btn-outline-info m-2",
        id: "imageButton",
        click: handleImageButton,
        text: "Применить",
      })
    );
    newWrapper.append(newList);
    renderToMarker(newWrapper);
  });
});

function handleImageButton() {
  let data = $("#imageList img");
  addResult(data);
  let resultText = [];
  for (let i in data.get()) {
    if ($(data[i]).hasClass("selected-image")) resultText.push(+i + 1);
  }
  renderResultArea("imageResult", "imageList", resultText);
}

$(document).ready(function () {
  $("#checkMarkers").click(function (e) {
    e.preventDefault();
    $.each(areas, function (i, elem) {
      $(elem).toggleClass("bordered");
    });
    $(this).text((i, text) =>
      text == "Проверить все маркеры"
        ? "Убрать проверку маркеров"
        : "Проверить все маркеры"
    );
  });
});

function clearBlock(block) {
  block.innerHTML = ""; //???
}

function addResult(data) {
  if (data.length == 0) {
    return;
  }
  let dataType = data[0].type || data[0].localName;
  if (dataType == "select-one") {
    dataType = "formValues";
  }
  let divId = "allResults" + dataType;
  let newDiv = $("<div />", {
    class: "row overflow-auto",
    id: divId,
  });

  if ($("#" + divId).length) {
    $("#" + divId).remove();
  }

  if (dataType == "img") {
    data.get().forEach((element) => {
      if ($(element).hasClass("selected-image"))
        newDiv.append(
          $("<img />", {
            class: "img-fluid",
            src: element.src,
            width: 50,
            height: 50,
          })
        );
    });
  } else {
    let resultText = data
      .get()
      .map((elem) => elem.value)
      .join(",");
    newDiv.append($("<p />").text(dataType + " : " + resultText));
  }
  $("#allResults").append(newDiv);
}

//Получение значений на случай если поля не связаны формой
// $(document).ready(function () {
//     $("#resultButton").click(function (e) {
//       e.preventDefault();
//       let data = [];
//       $(`input:text[name*=input]`).each(function (index, element) {
//         // element == this
//         let name = $(this).attr("name");
//         let value = $(this).val();
//         data.push({name:value});
//       })
//     })
// });
