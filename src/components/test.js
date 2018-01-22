<div className='header'>
    <div className='stack-info'>
        <div className='stack-name'>
            {this.props.selectedStack &&
                <h3>{this.props.selectedStack.name}</h3>
            }
        </div>

        <div 
            className ='token-container' 
            onMouseOver={()=>this.setState({showIntruction:true})}
            onMouseOut={()=>this.setState({showIntruction:false})}
        >
            <div className='token'/>
            <img className='token-img'src='pictures/myLogo.png'/>
            <h2>{this.props.tokens.totalTokens}</h2>
        </div>
    </div>

    <div className='header-menu'>     
        <button onClick={this.test}>test</button>
        <input
            type='text'
            placeholder='find cards by name'
            value = {this.state.findCard}
            onChange= {this.onFilterTextChange}
        />
        <button onClick={()=>this.selectAll(true)} className='add'>select all cards</button>
        <button onClick={()=>this.selectAll(false)} className='delete'>unselect all cards</button>
        <Link to='/flashCard'><button className='return'>return</button></Link>
        <Link to='/'><button className='return-home'>return home</button></Link>
    </div>
</div>