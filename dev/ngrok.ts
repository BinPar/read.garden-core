import ngrok from 'ngrok';
import chalk from 'chalk';

console.log(process.env.PORT);

await ngrok
  .connect({
    proto: 'http',
    addr: process.env.PORT ?? 3000,
  })
  .then((url) => {
    console.info(
      `::: ${chalk.yellow('Web available with Ngrok on:')} ${chalk.green(url)}`,
    );
  });
