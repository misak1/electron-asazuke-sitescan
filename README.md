# electron-sitescan

- electron-sitescanはelectron-asazukeのsitescanの機能をデスクトップアプリ化したものになります。
- electron-asazukeではphpのcurlでクロールしていたものを、今回ヘッドレスブラウザベースに書き直しています。
- ヘッドレスブラウザはcasperjsをnodeモジュールとして扱えるようにしたskoopyを使っています。
- このアプリを使う為には別途、phantomjsとcasperjsをインストールされている必要があります。
- phantomjsとcasperjsのインストールが未だの方はこのリポジトリ内に含まれるzipをご利用ください。
- Windowsユーザの方はzipファイルを展開し、PATHを通してください。Cドライブ直下に展開する場合は次のようになります。

```
1. phantomjsとcasperjsを展開してます。
c:\phantomjs-2.1.1-windows
c:\casperjs-1.1.3

2. 管理者でコマンドプロンプトを開いて次のコマンドを叩きます。
SETX /M PATH "%PATH%;c:\phantomjs-2.1.1-windows\bin"
SETX /M PATH "%PATH%;c:\casperjs-1.1.3\bin"
```

## 起動方法
```
npm start
```

## 課題
spookyでもelectronでアプリ化してしまうとcasperjsが起動出来ないようなので
`npm start`で起動して下さい。

## スクリーンショット
<img src="https://github.com/misak1/electron-asazuke-sitescan/blob/img-upload/images/ss-agif.gif?raw=true" width="480" alt="DOWNLOAD">
