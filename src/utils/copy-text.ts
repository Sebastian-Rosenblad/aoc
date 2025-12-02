export default function copyText(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    document.dispatchEvent(new ClipboardEvent('copy', {
      clipboardData: new DataTransfer(),
    }));
  });
}
