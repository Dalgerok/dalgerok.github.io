let isFirstUpdateDebank = true
let isFirstUpdateZerion = true
let isFirstUpdatingDebank = true
let isFirstUpdatingZerion = true

const codeWindowDebank = document.getElementById('area-code-debank')
const codeWindowZerion = document.getElementById('area-code-zerion')
const codeOutputDebank= document.getElementById('code-output-debank')
const codeOutputZerion= document.getElementById('code-output-zerion')
const walletsInput = document.getElementById('wallets-input')
const zerionSelect = document.getElementById('zerion-select')

const generateDebankCode = () => {
    const wallets = walletsInput.value.split('\n')
  
    const code = `
(function() {
    const wallets = ${JSON.stringify(wallets)};


    function fillInput(input, value) {
        input.setAttribute('value', value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
    }

    async function addWallets() {
        for (let i = 0; i < wallets.length; i++) {
            console.log(\`adding wallet \${i + 1} out of \${wallets.length}\`);

            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                if (button.textContent.includes('Add address')) {
                button.click()
                }
            });
            await new Promise((resolve) => setTimeout(resolve, 300));


            const inputs = document.querySelectorAll('input');
            fillInput(inputs[1], wallets[i]);
            await new Promise((resolve) => setTimeout(resolve, 1000));

            success = false
            while (!success) {
                let divs = document.querySelectorAll('div');
                divs.forEach(div => {
                if (div.className.includes('SearchAddress_address')) {
                    div.click()
                    success = true
                }
                });
                await new Promise((resolve) => setTimeout(resolve, 500));
            }
            await new Promise((resolve) => setTimeout(resolve, 3000));
        }

        console.log('completed');
    }

    addWallets();
})();`
  
    return code.trim()
}

const generateZerionCode = () => {
  const wallets = walletsInput.value.split('\n');
  const zerionSelect = document.getElementById('zerion-select')
  let walletsOrWatchlist = `'To My Wallets'`;
  if (zerionSelect.value == 'to watchlist') {
    walletsOrWatchlist = `'To Watchlist'`;
  }

  const code = `
(function() {
    const wallets = ${JSON.stringify(wallets)};

    
    function fillInput(input, value) {
        input.setAttribute('value', value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    async function addWallets() {
        for (let i = 0; i < wallets.length; i++) {
            console.log(\`adding wallet \${i + 1} out of \${wallets.length}\`);

            // wait until connect-wallet page is fully loaded
            for (let j = 0; j < 10; j++) { // max 10 seconds
                const input = document.querySelector('#track-asset-input');
                if (input) {
                    fillInput(input, wallets[i]);
                    break;
                }
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const spans = document.querySelectorAll('span');
            spans.forEach(span => {
                try {
                    span.click();
                } catch (ignore) {}
            });
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const divs = document.querySelectorAll('div')
            divs.forEach(div => {
                if (div.textContent == ${walletsOrWatchlist}) {
                    div.click()
                }
            });

            // wait until address page is fully loaded
            let success = false;
            for (let j = 0; j < 10; j++) { // max 10 seconds
                const divs = document.querySelectorAll('div');
                divs.forEach(div => {
                    if (div.textContent == 'Remove wallet') {
                        success = true;
                    }
                });
                if (success) break;
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
            await new Promise((resolve) => setTimeout(resolve, 3000));

            while (window.location.href !== 'https://app.zerion.io/connect-wallet') {
                window.history.back();
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
        }
    
        console.log('completed');
    }
    
    addWallets();
})();`

  return code.trim()
}

const updateDebankCode = () => {
  const code = generateDebankCode().split('\n')
  const lineNumbersDebank = document.getElementById('code-lines-debank')


  if (isFirstUpdateDebank) {
    lineNumbersDebank.innerHTML = ''

    isFirstUpdateDebank = false
    const typingDelay = (0.5 * 1000) / code.length
    let index = 0
    codeOutputDebank.textContent = ''

    const typeCode = () => {
      if (!isFirstUpdatingDebank) return
      if (index < code.length) {
        codeOutputDebank.textContent += code[index] + '\n'
        lineNumbersDebank.innerHTML += `<span>${index + 1}</span>`
        index++

        codeOutputDebank.innerHTML = Prism.highlight(
          codeOutputDebank.textContent,
          Prism.languages.javascript,
          'javascript'
        )

        setTimeout(typeCode, typingDelay)
      } else {
        isFirstUpdatingDebank = false
      }
    }

    typeCode()
  } else {
    isFirstUpdatingDebank = false
    lineNumbersDebank.innerHTML = ''
    for (let i = 1; i <= code.length; i++) {
      lineNumbersDebank.innerHTML += `<span>${i}</span>`
    }

    codeOutputDebank.innerHTML = Prism.highlight(
      code.join('\n'),
      Prism.languages.javascript,
      'javascript'
    )
  }
}

const updateZerionCode = () => {
    const code = generateZerionCode().split('\n')
    const lineNumbersZerion = document.getElementById('code-lines-zerion')
  
  
    if (isFirstUpdateZerion) {
      lineNumbersZerion.innerHTML = ''
  
      isFirstUpdateZerion = false
      const typingDelay = (0.5 * 1000) / code.length
      let index = 0
      codeOutputZerion.textContent = ''
  
      const typeCode = () => {
        if (!isFirstUpdatingZerion) return
        if (index < code.length) {
          codeOutputZerion.textContent += code[index] + '\n'
          lineNumbersZerion.innerHTML += `<span>${index + 1}</span>`
          index++
  
          codeOutputZerion.innerHTML = Prism.highlight(
            codeOutputZerion.textContent,
            Prism.languages.javascript,
            'javascript'
          )
  
          setTimeout(typeCode, typingDelay)
        } else {
          isFirstUpdatingZerion = false
        }
      }
  
      typeCode()
    } else {
      isFirstUpdatingZerion = false
      lineNumbersZerion.innerHTML = ''
      for (let i = 1; i <= code.length; i++) {
        lineNumbersZerion.innerHTML += `<span>${i}</span>`
      }
  
      codeOutputZerion.innerHTML = Prism.highlight(
        code.join('\n'),
        Prism.languages.javascript,
        'javascript'
      )
    }
}

const updateCode = () => {
    updateDebankCode();
    updateZerionCode();
}

const showAlertPopup = id => {
    const popup = document.getElementById(id)
    popup.classList.add('show')
}
  
const closeAlertPopup = id => {
    const popup = document.getElementById(id)
    popup.classList.remove('show')
}

const copyCodeOutputDebank = () => {
  const str = codeOutputDebank.innerText
  const el = document.createElement('textarea')
  el.value = str
  el.setAttribute('readonly', '')
  el.style.position = 'absolute'
  el.style.left = '-9999px'
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)

  showAlertPopup('code-copied-popup-debank')
  setTimeout(() => {
    closeAlertPopup('code-copied-popup-debank')
  }, 850)
}

const copyCodeOutputZerion = () => {
    const str = codeOutputZerion.innerText
    const el = document.createElement('textarea')
    el.value = str
    el.setAttribute('readonly', '')
    el.style.position = 'absolute'
    el.style.left = '-9999px'
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    showAlertPopup('code-copied-popup-zerion')
    setTimeout(() => {
        closeAlertPopup('code-copied-popup-zerion')
    }, 850)
  }

const updateWalletsLines = e => {
  const lines = e.target.value.split('\n').length
  const lineNumbers = document.getElementById('wallet-lines')

  lineNumbers.innerHTML = ''
  for (let i = 1; i <= lines; i++) {
    lineNumbers.innerHTML += `<span>${i}</span>`
  }

  walletsInput.style.height = `calc(${lines} * (1vh + 1vw) / 1.33)`
}

function swapColors() {
    const spans = document.querySelectorAll('header h1 span');
    spans.forEach((span, _) => {
      if (span.style.color === 'rgb(25, 94, 242)') span.style.color = 'rgb(255, 98, 56)';
      else span.style.color = 'rgb(25, 94, 242)';
    });
  }

function showFieldsZerion() {
    var fields_zerion = document.getElementById("code-window-zerion");
    var fields_debank = document.getElementById("code-window-debank");
    var zerion_button = document.getElementsByClassName("zerion_button")[0];
    var debank_button = document.getElementsByClassName("debank_button")[0];

    if (zerion_button.style.opacity == 1) { // means it's already active
        return;
    }

    swapColors();

    zerion_button.style.opacity = 1;
    debank_button.style.opacity = 0.2;

    fields_zerion.style.display = "";
    fields_debank.style.display = "none";
}

function showFieldsDebank() {

    var fields_zerion = document.getElementById("code-window-zerion");
    var fields_debank = document.getElementById("code-window-debank");
    var zerion_button = document.getElementsByClassName("zerion_button")[0];
    var debank_button = document.getElementsByClassName("debank_button")[0];

    if (debank_button.style.opacity == 1) { // means it's already active
        return;
    }

    swapColors();

    zerion_button.style.opacity = 0.2;
    debank_button.style.opacity = 1;

    fields_zerion.style.display = "none";
    fields_debank.style.display = "";
}

window.addEventListener('load', showFieldsZerion);
walletsInput.addEventListener('input', updateCode)
codeWindowDebank.addEventListener('click', copyCodeOutputDebank)
codeWindowZerion.addEventListener('click', copyCodeOutputZerion)
zerionSelect.addEventListener('input', updateCode)
walletsInput.addEventListener('input', updateWalletsLines)
