# ghost-storage-supabase

[Supabase](https://supabase.io) storage adapter for [Ghost](https://ghost.org). Recommended as a completely free storage solution for blogs being hosted on platforms with ephemeral filesystems, like [Heroku](https://heroku.com).

## Installation

```bash
cd /path/to/your/ghost/installation
mkdir -p content/adapters/storage/ghost-storage-supabase
```

After that, simply copy the contents of this repo into that newly created directory and run 

```bash
yarn install
```

## Usage

Add the following to your configuration file and modify it accordingly.

```json
"storage": {
    "active": "ghost-storage-supabase",
    "ghost-storage-supabase": {
        "bucket": "<your public bucket name>",
        "supabaseUrl": "<your supabase url>",
        "supabaseKey": "<your supabase anon key>"
    }
}
```

💡 To locate the information above, follow this [Supabase guide](https://supabase.io/docs/guides/api#api-url-and-keys). Buckets are readonly by default, even the public ones needed for this integration. After you have created your public bucket follow the [Policy guides](https://supabase.io/docs/guides/storage#policy-examples) in order to allow public uploading.

## Credit

Inspiration of this README came from https://github.com/ifvictr/ghost-storage-github

## License

[MIT License](LICENSE)
