# Promises Demo

Goals:

- Make a list of object (large)
- Each object returns a promise which is resolved after a timeout
- When resolved (or rejected) then place it in the HTML
- As promises get resolved run a tally counter

Optional:

- Have the data builder return a promise (for non blocking execution)
- Sort objects by ID
- Add florishing (animations / make pretty)

## Comentary

To illustrate the advanced benefit of asynchronous execution in JavaScript let
me explain what is happening.

We create an array of say 10,000 JavaScript objects each set with a random
title and unique ID. We also set a timeout value on them that randomly ranges
anywhere from 100 ms to 10000 ms (10 seconds).

We then spawn the timeout which waits the specified amount of time before it
resolves itself.

Once a promise is resolved we print it's information to the console and record
the amount of time that has passed since it was created to when it was
resolved.

If this was *synchronously* looping through and waiting the specified mount of
time it would take sequentially anywhere between 1,000,000 ms (1000 seconds) to
100,000,000 ms (100,000 seconds) to complete.

But because we used promises to spawn the execution asynchronously it only to
about 10,230 ms (a little over **10 seconds!**) Everything ran all at once!

This is the power of asynchronous execution and promises makes it a breeze to
conceptualize and manage.

## License

    This program is free software. It comes without any warranty, to
    the extent permitted by applicable law. You can redistribute it
    and/or modify it under the terms of the Do What You Want To Public
    License, Version 3, as published by Devin Weaver. See
    http://tritarget.org/wywtpl/COPYING for more details.
