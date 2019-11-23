## Common description
Console utility for transferring files over a network

Consists of Reader and Writer services

Reader reads and transfers data

Writer receives data from the Reader service, processes it and saves

Supported Transport

  - nats

  - websocket(In progress)
 
## Install Dependencies

```bash
npm install
```
    
## How to run service
* Fill .env file 

* Run writer
```bash
npm run writer -- --transport nats --download_dir './downloads' --channel 'transfer'

```

* Run reader
```bash
npm run reader -- --transport nats --file_path './uploads/movie.avi' --channel 'transfer'
```

Options(* - required)

    -- transport (nats/websocket. Default: nats)
  
    -- download-dir (directory to save file. Default: './downloads')
    
    -- file-path (path to file)*
    
    -- channel (transport channel name, must be the same for reader and writer. Default: 'transfer' )
