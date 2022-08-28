// 1번 html 대체
document.getElementById('name').innerHTML = "이순신"


// 2번 function 실행시 텍스트 대체
function loadHtml() {
    document.getElementById('chat').innerHTML = "hello"
}


// 3번 입력 출력
function valuetest() {
    // 입력값 취득
    var textString = document.getElementById("dat_in").value;
    console.log("입력값 = " + textString)
    // 입력값 출력
    document.getElementById("dat_out").value = textString;
}


// 4번 form 사용하여 서버에 데이터 보내기
$(function () {
    $('form').submit(function (event) {
        event.preventDefault();
        var param = $(this).serializeArray();
        // console.log(param);
        const name = param[0].value
        const gender = param[1].value
        // console.log(name + gender)
    });
});


// 5번 foreach
const arr = ['가', '나', '다']
arr.forEach(function (item, index, arr2) {
    // console.log(item, index, arr2[index + 1]);
})

const Arr = ['a', 'b', 'c', 'd', 'e'];
const newArr = Arr.forEach((currentElement, index, array) => {
    // console.log(`요소: ${currentElement}`);
    // console.log('요소: ' + currentElement);
    // console.log(index)
    // console.log(array)
    // console.log(item)
})

const Pet = ['강아지', '고양이', '독두꺼비']
const newPet = Pet.forEach((item, index, array) => {
    console.log(item)
    // console.log(array)
    const arr = array
    const dog = arr[0]
    const cat = arr[1]
    const dogcat = arr[2]
    document.getElementById('all').innerHTML = arr
    document.getElementById('pet').innerHTML = dog
    document.getElementById('cat').innerHTML = cat
    document.getElementById('dogcat').innerHTML = dogcat
})


// 6번
var div2 = document.getElementsByClassName("div2");

function handleClick(event) {
    console.log(event.target);
    // console.log(this);
    // 콘솔창을 보면 둘다 동일한 값이 나온다

    console.log(event.target.classList);

    if (event.target.classList[1] === "clicked") {
        event.target.classList.remove("clicked");
    } else {
        for (var i = 0; i < div2.length; i++) {
            div2[i].classList.remove("clicked");
        }

        event.target.classList.add("clicked");
    }
}

function init() {
    for (var i = 0; i < div2.length; i++) {
        div2[i].addEventListener("click", handleClick);
    }
}

init();






