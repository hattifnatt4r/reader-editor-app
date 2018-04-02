<?php
namespace App\Http\Controllers;

use App\User;
use App\Message;
use App\Connection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
//use vendor\laravel\framework\src\Illuminate\Http\Request;
class UserController extends Controller
{

	
	// Start here
	public function getHomePage()
	{
		$msg = 'EMPTY';
		if (!Auth::user()){
			$this -> getLogout();
			$msg = \Request::ip();
		}
		$user = User::where('id', Auth::user()->id);
		$username = $user -> value('first_name');
		$ifread   = $user -> value('read');
		if (gettype($ifread)!='integer'){ $ifread=0; }
		
		return view('index', [
						'in_contacts'=> false, 
						'in_messages'=> false, 
						'create'     => 'no', 
						'username'   => $username,
						'ifreads'    => '', 
						'ifread'     => (string)$ifread, 
		] ) ->with(['msg'=>$msg]);
		
	}
	
	public function getLoginPage()
	{
		return redirect()->route('home') ->with(['msg'=>'empty']);
	}
	
	
	public function getDashboard()
	{
		$res = array();
		$user_id = Auth::user()->id;
		$msg = 'Connections: ';
		
		$items = Connection::where('user_id_1', $user_id)->get();
		foreach ($items as $item){
			$i = $item->user_id_2;
			array_push($res, $i);
			$msg = $msg.', '.$i;
		}
		$items = Connection::where('user_id_2', $user_id)->get();
		foreach ($items as $item){
			$i = $item->user_id_1;
			array_push($res, $i);
			$msg = $msg.', '.$i;
		}
		
		
		$posts = Message::where('user_id', Auth::user()->id )->get();
		return view('dashboard', ['posts'=>[], 'connections'=>$res, 'id_to'=>-1]);
		
	}
	
	
	
	public function postSignUp(Request $request) 
	{	
		$msg = 'Success';
		if (!$this->validate($request, [
			'first_name' => 'required|max:20|unique:users',
			'password' => 'required|min:4'
		]) ) { return redirect()->route('home'); }
		
		$email    = $request['email'];
		$username = $request['first_name'];
		$password = bcrypt($request['password']);
		
		$user = new User();
		$user->email = $email;
		$user->first_name = $username;
		$user->password = $password;
		
		$user-> save();
		
		Auth::login($user);
		
		return view('index', [
						'in_contacts'=> false, 
						'in_messages'=> false, 
						'create'     => 'yes', 
						'username'   => $username, 
						'ifread'     => '', 
						'ifreads'    => '', 
		] ) ->with(['msg'=>$msg]);

	}
	
	public function postSignIn(Request $request)
	{
		$msg = 'SignIn Error';
		
		if (!$this->validate($request, [
			'first_name' => 'required',
			'password' => 'required'
		]) ){ return redirect()->route('home'); }
		
		if ( $request['first_name']=='name' ){
			$msg = 'SignIn Error wrong name';
		}else if (Auth::attempt(['first_name'=>$request['first_name'], 'password'=>$request['password']] )){
			$msg = 'SignIn success';
		}
		return redirect()->back() ->with(['msg'=>$msg]);
	}
	
	public function getLogout()
	{
		Auth::logout();
		if (!Auth::attempt(['first_name'=>'guest', 'password'=>'guest']) ){
			Auth::attempt(['first_name'=>'test', 'password'=>'test']);
		}
		return redirect()->route('home');
	}
	
	public function getDeleteUser()
	{
		$msg = 'Error';
		$username    = User::where('id', Auth::user()->id) -> value('first_name');
		if ($username=='guest'){
			return redirect()->back() ->with(['msg'=>$msg]);
		}else{
			$user = User::find(Auth::user()->id);
			Auth::logout();
			$user->delete();
			return redirect()->route('home');
		}
	}
	
}


