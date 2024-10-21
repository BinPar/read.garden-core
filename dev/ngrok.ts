import ngrok from 'ngrok';
import chalk from 'chalk';

await ngrok
  .connect({
    proto: 'http',
    addr: 8080,
  })
  .then((url) => {
    console.info(
      `::: ${chalk.yellow('And available with Ngrok on:')} ${chalk.green(url)}`,
    );
  });
