# evm-example-contracts

「Native Token」「ERC20 Token」の Transfer が実行可能です

「独自の ERC20 Contract」の Deploy が実行可能です

「Oracle を使用したランダム Token Transfer」が実行可能です

Sepolia, Polygon Amoy, Oasys に対応しています。（Native Token Transfer, 独自の ERC20 Contract のみ）

![スクリーンショット (176)](https://github.com/user-attachments/assets/8dbe2059-f2fe-4634-a06e-f029642c0ef5)

## セットアップと起動方法

1. リポジトリをクローンします

```bash
git clone git@github.com:XIV-Y/evm-example-contracts.git
```

```bash
cd evm-example-contracts
```

2. compiled-customERC20.js の生成

```bash
docker-compose up
```

```bash
docker-compose exec dev npx hardhat run scripts/customERC20/compile-for-react.js
```

生成された `customERC20.js` を `frontend/src/contracts` に `compiled-customERC20.js` リネームを行い配置

3. 環境変数の設定

https://cloud.reown.com で ProjectID を取得する。

取得した ProjectID を `frontend/.env` の `VITE_PROJECT_ID` に設定する

5. frontend の起動

```bash
cd frontend
```

```bash
npm i
```

```bash
npm run dev
```

## hardhat コマンド

`.env.example` にある環境変数の値を事前に設定します

### ERC20 Contract Deploy
```bash
docker-compose exec dev npx hardhat run scripts/deploy.js --network sepolia
```

#### Contract Verify
```bash
docker-compose exec dev npx hardhat verify --network sepolia --contract contracts/erc20.sol:XIVYToken <CONTRACT_ADDRESS>
```

### Custom ERC20 Contract Deploy
```bash
docker-compose exec dev npx hardhat run scripts/customERC20/deploy.js --network sepolia
```

### Random ERC20 Contract Deploy
```bash
docker-compose exec dev npx hardhat run scripts/erc20RandomToken/deploy.js --network sepolia
```

### テストの実行
```bash
docker-compose exec dev npx hardhat test
```

### Upgrade Contract

初回デプロイを行う場合は `upgradeERC20/deploy.js` の `deploy()` を実行します

```bash
docker-compose exec dev npx hardhat run scripts/upgradeERC20/deploy.js --network sepolia
```

upgrade を行う場合は `upgradeERC20/deploy.js` の `upgrade()` を実行します

`proxyAddress` にデプロイしたコントラクトアドレスに書き換えます

```bash
docker-compose exec dev npx hardhat run scripts/upgradeERC20/deploy.js --network sepolia
```
