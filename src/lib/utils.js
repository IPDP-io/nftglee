const SATS = 100000000;

export const validateEmail = (email) => {
	const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
};

export const btc = (n) => (n / SATS).toFixed(8);

export const copy = (v) => {
  let textArea = document.createElement("textarea");
  textArea.style.position = "fixed";
  textArea.value = v;

  document.body.appendChild(textArea);

  textArea.focus();
  textArea.select();

  document.execCommand("copy");
  document.body.removeChild(textArea);
};
