# electron-sitescan

`electron-sitescan` は `electron-asazuke` の sitescan の機能をデスクトップアプリ化したものになります。

- electron-asazukeではphpのcurlでクロールしていたものを、今回ヘッドレスブラウザベースに書き直しています。
- ヘッドレスブラウザはcasperjsをnodeモジュールとして扱えるようにしたskoopyを使っています。
- このアプリを使う為には別途、phantomjsとcasperjsをインストールされている必要があります。
- phantomjsとcasperjsのインストールが未だの方はこのリポジトリ内に含まれるzipをご利用ください。
- Windowsユーザの方はzipファイル(./docs/setup_resources/ にあります)を展開し、PATHを通してください。Cドライブ直下に展開する場合は次のようになります。


## セットアップ手順

Mac の方は [Macユーザー向け](./docs/SETUP-mac.md) を、 Windows の方は [Windowsユーザー向け](./docs/SETUP-win.md) を参照してください。


## 実行環境

- node@6.9.1
- npm@3.10.8
- electron@1.4.13
- phantomjs@2.1.1
- casperjs@1.1.3


## 起動方法

```
$ npm start
```


## 設定

- `data/userAgent.json`
    - USER_AGENT の一覧を定義します。
- `data/viewport.json`
    - viewport の一覧を定義します。


## 課題

electronでアプリ化すると spooky(casperjs) が起動出来ない問題があるので `npm start` から起動して下さい。


## スクリーンショット

<img src="https://github.com/misak1/electron-asazuke-sitescan/blob/img-upload/images/ss-agif.gif?raw=true" width="480" alt="DOWNLOAD">
