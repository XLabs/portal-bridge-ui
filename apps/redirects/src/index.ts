process.stdout.write(JSON.stringify({
    title: process.env.TITLE || "",
    main: process.env.MAIN || "",
    description: process.env.DESCRIPTION || "",
}));