<p align="center">
    <img src="https://user-images.githubusercontent.com/32086218/142848786-46e8db54-e9ed-4672-852c-8e46cbd6502a.png" />
    <div align="center">
	    <strong>🚩 A Minesweeper game for your terminal written with <a href="https://github.com/facebook/react">ReactJS</a> & <a href="https://github.com/vadimdemedes/ink">ink</a> 😎
	    </strong>
    </div>
</p>

## Run
```bash
npx mnswpr
```
## Install globally
```bash
npm install -g mnswpr
mnswpr
```

## Supported terminals
![legacy mode](https://user-images.githubusercontent.com/32086218/141684622-dcf166b5-1d66-4f03-a895-8f14edec6132.gif)

The interface works with emoji by default. If your terminal doesn't support it, you can either switch to legacy mode by pressing `l` button or update your terminal (For Windows I suggest  [Windows Terminal](https://github.com/microsoft/terminal))



## Options

```
Usage: mnswpr

Options:

  --legacy, -L
        Legacy mode. Use this if your terminal doesn't support emojis
	      
  --center, -C
        Align the field to the center of the terminal
        
  --quick [b|i|e|width,height,mines], -Q [b|i|e|width,height,mines] 
        Start game directly with one of the difficulties: [b|i|e] or a custom field: ${customFieldFormat}
        Examples:
          mnswpr --quick b #start game with beginner difficulty
          mnswpr -Q 10,20,60 #start game with custom field width:10 height:20 mines:60
```

